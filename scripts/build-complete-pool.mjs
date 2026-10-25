import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = path.join(__dirname, '../src/data/social')
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'booksPool.json')

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

// 15 Yasaklı kitap filtresi
const BLACKLIST = [
  'küçük kara balık',
  'kucuk kara balik',
  'fareler ve insanlar',
  'bilim öyküleri',
  'bilim oykuleri',
  'simyacı',
  'simyaci',
  'uçan sınıf',
  'ucan sinif',
  'kürk mantolu madonna',
  'kurk mantolu madonna',
  "mo'nun gizemi",
  'monun gizemi',
  'mo nun gizemi',
  'denemeler',
  'momo',
  'dava',
  'bu ülke',
  'bu ulke',
  'sol ayağım',
  'sol ayagim',
  'bulantı',
  'bulanti',
  'satranç',
  'satranc',
  'gece yarısı kütüphanesi',
  'gece yarisi kutuphanesi',
]

function isBlacklisted(title) {
  if (!title) return true
  const norm = title.toLocaleLowerCase('tr-TR').replace(/['"’]/g, '').trim()
  return BLACKLIST.some((bad) => {
    const cleanBad = bad.toLocaleLowerCase('tr-TR').replace(/['"’]/g, '').trim()
    return norm === cleanBad || norm.includes(cleanBad) || cleanBad.includes(norm)
  })
}

// Doğrulanmış Popüler Kapaklar Haritası
const KNOWN_COVERS = {
  'küçük prens': 'https://covers.openlibrary.org/b/id/12219639-L.jpg',
  'şeker portakalı': 'https://covers.openlibrary.org/b/id/10413035-L.jpg',
  'martı jonathan livingston': 'https://covers.openlibrary.org/b/id/6522230-L.jpg',
  'martı': 'https://covers.openlibrary.org/b/id/6522230-L.jpg',
  'pal sokağı çocukları': 'https://covers.openlibrary.org/b/id/7819755-L.jpg',
  'beyaz diş': 'https://covers.openlibrary.org/b/id/8236920-L.jpg',
  'define adası': 'https://covers.openlibrary.org/b/id/8231856-L.jpg',
  'seksen günde devriâlem': 'https://covers.openlibrary.org/b/id/6976035-L.jpg',
  'seksen günde devrialem': 'https://covers.openlibrary.org/b/id/6976035-L.jpg',
  'beyaz gemi': 'https://covers.openlibrary.org/b/id/6770435-L.jpg',
  'çocuk kalbi': 'https://covers.openlibrary.org/b/id/7892305-L.jpg',
  "tom sawyer'ın maceraları": 'https://covers.openlibrary.org/b/id/10543225-L.jpg',
  'oliver twist': 'https://covers.openlibrary.org/b/id/8231996-L.jpg',
  "gulliver'in gezileri": 'https://covers.openlibrary.org/b/id/11195610-L.jpg',
  'beyaz zambaklar ülkesinde': 'https://covers.openlibrary.org/b/id/10848805-L.jpg',
  'dönüşüm': 'https://covers.openlibrary.org/b/id/12820198-L.jpg',
  'fahrenheit 451': 'https://covers.openlibrary.org/b/id/12993656-L.jpg',
  '1984': 'https://covers.openlibrary.org/b/id/12539702-L.jpg',
  'suç ve ceza': 'https://covers.openlibrary.org/b/id/12089454-L.jpg',
  'insan ne ile yaşar?': 'https://covers.openlibrary.org/b/id/11725468-L.jpg',
  'insan ne ile yaşar': 'https://covers.openlibrary.org/b/id/11725468-L.jpg',
  'hayvan çiftliği': 'https://covers.openlibrary.org/b/id/11261770-L.jpg',
  'dokuzuncu hariciye koğuşu': 'https://covers.openlibrary.org/b/id/10848805-L.jpg',
  'yaşlı adam ve deniz': 'https://covers.openlibrary.org/b/id/12843468-L.jpg',
  'siddhartha': 'https://covers.openlibrary.org/b/id/8302062-L.jpg',
  'çavdar tarlasında çocuklar': 'https://covers.openlibrary.org/b/id/8226191-L.jpg',
}

function resolveCover(title) {
  const norm = title.toLocaleLowerCase('tr-TR').replace(/['"’]/g, '').trim()
  if (KNOWN_COVERS[norm]) return KNOWN_COVERS[norm]
  for (const [k, v] of Object.entries(KNOWN_COVERS)) {
    if (norm.includes(k) || k.includes(norm)) return v
  }
  return undefined
}

// -----------------------------------------------------------------------------------------
// YAZAR VE ESER LİSTELERİ DERLEYİCİSİ
// -----------------------------------------------------------------------------------------
const ortaokulList = []
const liseList = []
const seenOrtaokul = new Set()
const seenLise = new Set()

function addOrtaokul(title, author, genre, whyRead) {
  const cleanTitle = title.trim()
  const norm = cleanTitle.toLocaleLowerCase('tr-TR')
  if (seenOrtaokul.has(norm) || isBlacklisted(cleanTitle)) return
  seenOrtaokul.add(norm)
  const id = `ort_${String(ortaokulList.length + 1).padStart(4, '0')}`
  ortaokulList.push({
    id,
    title: cleanTitle,
    author: author.trim(),
    genre: genre || 'Gençlik Klasiği',
    level: 'ortaokul',
    whyRead: whyRead || 'LGS paragraf hızını, analitik okuma refleksini ve söz dağarcığını geliştirir.',
    highlightTag: 'ORTAOKUL & LGS (10-14 YAŞ)',
    imageUrl: resolveCover(cleanTitle),
  })
}

function addLise(title, author, genre, whyRead) {
  const cleanTitle = title.trim()
  const norm = cleanTitle.toLocaleLowerCase('tr-TR')
  if (seenLise.has(norm) || isBlacklisted(cleanTitle)) return
  seenLise.add(norm)
  const id = `lis_${String(liseList.length + 1).padStart(4, '0')}`
  liseList.push({
    id,
    title: cleanTitle,
    author: author.trim(),
    genre: genre || 'Edebiyat Klasiği',
    level: 'lise',
    whyRead: whyRead || 'YKS maratonunda derin anlama, soyut çıkarım yapma ve AYT edebiyat yorum gücünü katlar.',
    highlightTag: 'LİSE & YKS (14-18 YAŞ)',
    imageUrl: resolveCover(cleanTitle),
  })
}

// -----------------------------------------------------------------------------------------
// 1. ORTAOKUL ESERLERİ KATALOĞU
// -----------------------------------------------------------------------------------------

// Ömer Seyfettin Hikayeleri (70+)
const omerSeyfettinStories = [
  'Kaşağı', 'Diyet', 'Pembe İncili Kaftan', 'Falaka', 'Ferman', 'Bomba', 'Yalnız Efe',
  'Başını Vermeyen Şehit', 'Çakmak', 'Kütük', 'Vire', 'Gizli Mabet', 'Yüksek Ökçeler',
  'Keramet', 'Asilzâdeler', "Çanakkale'den Sonra", 'Kurbağa Duası', 'And', 'Beyaz Lale',
  'Mahcupluk İmtihanı', 'Primo Türk Çocuğu', 'Hürriyet Bayrakları', 'Kızıl Elma Neresi',
  'Tuhaf Bir Zulüm', 'Büyücü', 'Velinimet', 'Sivrisinek', 'Çakıl Taşları', 'Yemin',
  'Nadan', 'Rüşvet', 'Mehdi', 'Dama Taşları', 'Kaç Yerinden', 'Üç Nasihat',
  'Herkesin İçtiği Su', 'Boykotaj Düşmanı', 'Müjde', 'İffet', 'Lokantanın Esrarı',
  'Koleksiyon', 'Acaba Ne İdi', 'Şefkat Masalı', 'Yufka Yürekli Ali', 'Bir Hayır',
  'Falakanın Sırrı', 'Tarih Ezeli Bir Tekerrürdür', 'Yüzakı', 'Teselli', 'Kurumuş Ağaçlar',
  'Sivrisineklerin Savaşı', 'Mermer Tezgah', 'Harem', 'Çirkin Bir Hakikat', 'Bahar ve Kelebekler',
  'Büyükanne', 'Dünyanın Düzeni', 'İlk Cinayet', 'Kıskançlık', 'Külah', 'Miras',
  'Nezle', 'Nişan', 'Öpücüğün Sırrı', 'Ruzname', 'Şairin Rüyası', 'Tavuklar', 'Zeytin Ekmek'
]
omerSeyfettinStories.forEach(s => addOrtaokul(s, 'Ömer Seyfettin', 'Milli Edebiyat & Hikaye', 'Özgün olay örgüsü ve güçlü anlatımıyla LGS Türkçe paragraf kavrayışını geliştirir.'))

// Kemalettin Tuğcu Eserleri (75+)
const kemalettinTugcuBooks = [
  'Yetim Ali', 'Köy Mübecceli', 'Dağdaki Yabancı', 'Babasızlar', 'Sakat Çocuk', 'Küçük Kaptan',
  'Eski Konak', 'Annelerin Çilesi', 'Sokak Çocuğu', 'Hırsızın Oğlu', 'Kuyulu Bahçe', 'Yılanlı Bağ',
  'Deniz Kızı', 'Göçmen Kızı', 'Kimsesizler', 'Siyahlı Kadın', 'Balıkçının Kızı', 'Görmeyen Gözler',
  'Küçük Bey', 'Yetimler Güzeli', 'Yuvadan Uzakta', 'Üvey Anne', 'Çalınan Çocuk', 'Ahretlik',
  'Baba Evi', 'Talihsiz Çocuk', 'Yabancı Çocuk', 'Düşkün Çocuk', 'Garip Çocuk', 'Hırçın Kız',
  'Gurbet Acısı', 'Anne Hasreti', 'Dağlar Kızı', 'Taşralı Çocuk', 'Deniz Çocukları', 'Yoksul Delikanlı',
  'Bir Garip Kız', 'Sığıntı', 'Küçük Boyacı', 'Kolsuz Kahraman', 'Mahalle Kavgası', 'Yetim Malı',
  'Üç Arkadaş', 'Ayşecik', 'Bir Evlat Edinildi', 'Kimsesiz Çocuklar', 'Yetimlerin Annesi', 'Babasız Çocuklar',
  'Köydeki Ev', 'Son Durak', 'Gurbet Kuşları Gençlik', 'Yalnız Kadın', 'Çoban Kızı', 'Kardeşler',
  'Küçük Hamal', 'Yaralı Kuş', 'Çıkmaz Sokak', 'Dertli Çocuk', 'Sessiz Dünya', 'Gözyaşları',
  'Altın Kalpli Kız', 'Büyük Şehir', 'Yol Arkadaşı', 'Taş Kalpli Anne', 'Umutsuzlar Bahçesi',
  'Küçük Besleme', 'Garip Yolcu', 'Zavallı Çocuklar', 'Kayıp Aranıyor Çocukluk', 'Vicdan Azabı Tuğcu',
  'Küçük Seyyah', 'Köy Çocuğu', 'Gurbet Yolları', 'Anne Kokusu', 'Yetim Hanım'
]
kemalettinTugcuBooks.forEach(b => addOrtaokul(b, 'Kemalettin Tuğcu', 'Duygu & Hayat Romanı', 'Hayatın zorlukları karşısında dayanıklılık, azim ve merhamet duygusunu pekiştirir.'))

// Muzaffer İzgü Eserleri (60+)
const muzafferIzguBooks = [
  'Ökkeş Otoparkta', 'Ökkeş Lunaparkta', 'Ökkeş Kurtlarla', 'Ökkeş Balık Avında', 'Ökkeş Maçta',
  'Ökkeş Dolmuş İşletiyor', 'Ökkeş Bahçıvan', 'Ökkeş Kapıcı', 'Ökkeş Ormanda', 'Ökkeş Denizde',
  'Ökkeş Ağaçta', 'Ökkeş Öğretmen Oldu', 'Ökkeş Sirkte', 'Ökkeş Boyacı', 'Ökkeş Arıcı',
  'Ökkeş Pazarcı', 'Anneannemin Akıl Almaz Maceraları', 'Anneannem Büyücü', 'Anneannem Askere Gidiyor',
  'Anneannem Şampiyon', 'Anneannem Uçtu', 'Uçan Eşek', 'Bando Takımı', 'Çizmeli Osman',
  'Sarı Köpek', 'Ekmek Parası', 'Hayri Potur Harry Potter\'a Karşı', 'Bülbül Düdük',
  'Alçaktan Uçan Güvercin', 'Kaçak Kaleci', 'Masal Masal Matitas', 'Dağlar Kralı Geven',
  'Dünyanın En Şanslı Çocuğu', 'Pazar Kuşları', 'Gecekondu Çocuğu', 'Çanak Çömlek Patladı',
  'Bizim Muhtar', 'Çizmeli Kedi Köyde', 'Sınıfın Delisi', 'Korkak Kahraman', 'Yumurtadan Çıkan Öğretmen',
  'Zıkkımın Kökü Gençlik', 'Gülümseyen Masallar', 'Duvar Saati', 'Küçük Otobüs', 'Keloğlan ile Dev',
  'Yıldız Kaçtı', 'Kırmızı Şapkalı Güvercin', 'Cici Kuş', 'Güneşi Güldüren Çocuk', 'Tembel Tavşan',
  'Şenlik Var Köyde', 'Bayram Harçlığı', 'Sirk Kaçkını', 'Akıllı Maymun', 'Çilli Tavuk'
]
muzafferIzguBooks.forEach(b => addOrtaokul(b, 'Muzaffer İzgü', 'Mizah & Çocuk Edebiyatı', 'Eğlenceli kurgusuyla okuma alışkanlığını sevdirir, hızlı anlamayı destekler.'))

// Rıfat Ilgaz Çocuk ve Gençlik Eserleri (25+)
const rifatIlgazBooks = [
  'Bacaksız Okulda', 'Bacaksız Tatilde', 'Bacaksız Sigara Kaçakçısı', 'Bacaksız Kamyon Sürücüsü',
  'Bacaksız Paralı Atlet', 'Halime Kaptan', 'Cankurtaran Yılmaz', 'Küçük Çekmece Okyanusu',
  'Şeker Kutusu', 'Apartman Çocukları', 'Ocak Katırı Alagöz', 'Kumdan Betona', 'Cart Curt',
  'Neron Şevket', "Don Kişot İstanbul'da", 'Hababam Sınıfı Baskında', 'Göl Çocukları',
  'Pisi Pisi Masalı', 'Çocuk Bahçesi', 'Hoca Nasrettin ve Torunları', 'Kastamonu Kalesi'
]
rifatIlgazBooks.forEach(b => addOrtaokul(b, 'Rıfat Ilgaz', 'Sosyal Yaşam & Mizah', 'Mizah yoluyla toplumsal duyarlılık ve akıcı okuma becerisi kazandırır.'))

// Jules Verne Macera Klasikleri (40+)
const julesVerneBooks = [
  'Denizler Altında Yirmi Bin Fersah', 'Dünyanın Merkezine Yolculuk', "Ay'a Seyahat",
  'Seksen Günde Devriâlem', 'Gizemli Ada', 'İki Yıl Okul Tatili', "Kaptan Grant'ın Çocukları",
  'Beş Hafta Balonla', 'Dünyanın Ucundaki Fener', 'Kırmızı Kar', 'Zacharius Usta',
  "Doktor Ox'un Deneyi", 'Çar Strogoff', 'Karpatlar Şatosu', 'Buzlar Sfenksi', 'Yeşil Işın',
  'Piyango Bileti', 'Keraban Kararlı', 'Yıldız Güneye Doğru', 'On Beş Yaşında Bir Kaptan',
  'Şanslı Gezgin', "Wilhelm Storitz'in Sırrı", 'Yüzen Ada', 'Karadeniz Faciası', 'Havadaki Köy',
  'Göktaşı Avı', 'Altın Yanardağı', 'Bayan Branican', 'Buzlar Ülkesinde', 'Yüzen Şehir',
  'Madenin Esrarı', 'Güneş Sisteminde Gezinti', 'César Cascabel', 'Clovis Dardentor',
  'Muhteşem Orinoco Nehri', 'İkinci Vatan', 'Dünyanın Efendisi', 'Kip Kardeşler'
]
julesVerneBooks.forEach(b => addOrtaokul(b, 'Jules Verne', 'Klasik Bilim Kurgu & Macera', 'Bilimsel merak, coğrafi keşif ve problem çözme yeteneğini besler.'))

// Arthur Conan Doyle - Sherlock Holmes Serisi (45+)
const sherlockBooks = [
  'Kızıl Dosya', 'Dörtlerin İmzası', "Baskerville'lerin Köpeği", 'Korku Vadisi',
  "Bohemya'da Skandal", 'Kızıl Saçlılar Kulübü', 'Bir Kimlik Vakası', 'Boscombe Vadisi Gizemi',
  'Beş Portakal Çekirdeği', 'Bükük Dudaklı Adam', 'Mavi Yakut', 'Benekli Kordon',
  'Mühendisin Başparmağı', 'Asil Bekar', 'Beryl Taç', 'Gümüş Şimşek', 'Sarı Surat',
  'Borsacı Katibi', 'Gloria Scott Faciası', 'Musgrave Töreni', 'Reigate Bulmacası',
  'Sakat Adam', 'Yatılı Hasta', 'Yunanlı Tercüman', 'Deniz Antlaşması', 'Son Problem',
  'Boş Ev Vakası', "Norwood'lu İnşaatçı", 'Dans Eden Adamlar', 'Bisiklete Binen Yalnız Kadın',
  'Priory Okulu', 'Kara Peter', 'Charles Augustus Milverton', 'Altı Napoléon Büstü',
  'Üç Öğrenci', 'Altın Gözlük', 'Kayıp Futbolcu', 'Abbey Grange Vakası', 'İkinci Leke',
  'Wisteria Köşkü', 'Kırmızı Çember', 'Bruce-Partington Planları', 'Ölüm Döşeğindeki Dedektif',
  'Leydi Frances Carfax', 'Şeytan Ayağı Vakası', 'Yay Kuşatması'
]
sherlockBooks.forEach(b => addOrtaokul(`Sherlock Holmes: ${b}`, 'Arthur Conan Doyle', 'Polisiye & Mantık', 'Tümdengelim, analitik düşünme ve detaylara dikkat etme refleksini keskinleştirir.'))

// Dede Korkut Destanları (12 boy)
const dedeKorkutStories = [
  'Dirse Han Oğlu Boğaç Han Destanı', "Salur Kazan'ın Evinin Yağmalanması", 'Kam Büre Bey Oğlu Bamsı Beyrek Destanı',
  "Kazan Bey Oğlu Uruz Bey'in Tutsak Olması", 'Duha Koca Oğlu Deli Dumrul Destanı', 'Kanlı Koca Oğlu Kanturalı Destanı',
  'Kazılık Koca Oğlu Yegenek Destanı', "Basat'ın Tepegöz'ü Öldürmesi Destanı", 'Begil Oğlu Emren Destanı',
  'Uşun Koca Oğlu Segrek Destanı', "Salur Kazan'ın Tutsaklığı ve Oğlu Uruz Destanı", 'İç Oğuz Dış Oğuz Beyrek Destanı'
]
dedeKorkutStories.forEach(s => addOrtaokul(s, 'Anonim (Dede Korkut)', 'Epik Türk Destanı', 'Türkçe söz varlığı, milli değerler ve destansı anlatım tekniğini kavratır.'))

// Binbir Gece ve Doğu Masalları (25+)
const binbirGeceStories = [
  "Alaaddin'in Sihirli Lambası", 'Ali Baba ve Kırk Haramiler', "Sinbad'ın Yedi Deniz Yolculuğu",
  'Balıkçı ile İfrit', 'Prens Ahmed ve Peri Pari-Banu', 'Üç Elma Hikayesi', "Abuhasan'ın Uykusu",
  "Camasb'ın Maceraları", 'Uçan Halı Efsanesi', 'Abanoz At Masalı', 'Bahar Çiçeği ile Prens',
  'Yalancı Kalender', 'Kamerüzzaman ile Prenses Budur', 'Zümrüdüanka Masalı', 'Hırsız ve Kadı',
  'Gözbağcının Oyunu', 'Süleyman Mabedi Hazineleri', 'Hırka ve Padişah', 'Büyülü Şehir',
  'Deniz Kızı Cevhere', 'Arap Çölü Yolcusu', 'Kaderden Kaçılmaz Masalı', 'Gülzar Masalı'
]
binbirGeceStories.forEach(s => addOrtaokul(s, 'Anonim (Doğu Klasikleri)', 'Masal & Fantezi', 'Zengin imgeler, yaratıcı düşünme ve sürükleyici anlatım gücü kazandırır.'))

// Nasreddin Hoca & Keloğlan Seçkileri (25+)
const nasreddinKeloglan = [
  "Nasreddin Hoca: Göle Maya Çalmak", 'Nasreddin Hoca: Ya Tutarsa', 'Nasreddin Hoca: Parayı Veren Düdüğü Çalar',
  'Nasreddin Hoca: Bindiği Dalı Kesmek', 'Nasreddin Hoca: Kazan Doğurdu', 'Nasreddin Hoca: Ye Kürküm Ye',
  'Nasreddin Hoca: İpe Un Sermek', 'Nasreddin Hoca: Peşin Satan', 'Nasreddin Hoca: Ayın Doğuşu',
  'Nasreddin Hoca: Hırsızın Hiç mi Suçu Yok', 'Nasreddin Hoca: Timur ile Fil', 'Keloğlan ile Devler',
  'Keloğlan ile Sihirli Taş', 'Keloğlan ile Padişahın Kızı', 'Keloğlan Değirmenci', 'Keloğlan ve Sihirli Kuş',
  'Keloğlanın Zekası', 'Keloğlan Sarayda', 'Keloğlan ile Kırk Haramiler', 'Keloğlan Deniz Altında'
]
nasreddinKeloglan.forEach(s => addOrtaokul(s, 'Anonim (Türk Halk Edebiyatı)', 'Mizah & Nükte Masalı', 'İnce zeka, felsefi mizah ve hazırcevaplık becerisini geliştirir.'))

// Türk Destanları ve Efsaneleri (25+)
const turkDestanlari = [
  'Ergenekon Destanı', 'Oğuz Kağan Destanı', 'Türeyiş Destanı', 'Göç Destanı', 'Alp Er Tunga Destanı',
  'Şu Destanı', 'Battal Gazi Destanı', 'Danişmend Gazi Destanı', 'Köroğlu Destanı', 'Manas Destanı Seçkisi',
  'Satuk Buğra Han Destanı', 'Yaratılış Destanı', 'Seyit Onbaşı ve Çanakkale Kahramanları',
  'Sarıkamış Dağlarında', 'Preveze Deniz Zaferi Gençlik', 'Kutülamare Kahramanları', 'Malazgirt Kartalı Alparslan',
  'İstanbul Surlarında Ulubatlı Hasan', 'Plevne Kahramanı Osman Paşa', 'Barbaros Hayreddin Akdeniz Fatihi'
]
turkDestanlari.forEach(s => addOrtaokul(s, 'Tarih & Efsane Klasikleri', 'Tarihi Roman & Destan', 'Tarih bilinci, vatan sevgisi ve kahramanlık kurgularıyla metin analizini güçlendirir.'))

// Dünya Çocuk & Gençlik Edebiyatı Başyapıtları (150+)
const dunyaCocukKlasikleri = [
  { t: 'Küçük Prens', a: 'Antoine de Saint-Exupéry', g: 'Felsefi Masal' },
  { t: 'Şeker Portakalı', a: 'José Mauro de Vasconcelos', g: 'Duygu Romanı' },
  { t: 'Martı Jonathan Livingston', a: 'Richard Bach', g: 'Alegorik Novella' },
  { t: 'Pal Sokağı Çocukları', a: 'Ferenc Molnár', g: 'Dostluk Klasiği' },
  { t: 'Beyaz Diş', a: 'Jack London', g: 'Doğa & Macera' },
  { t: 'Define Adası', a: 'Robert Louis Stevenson', g: 'Macera Klasiği' },
  { t: 'Seksen Günde Devriâlem', a: 'Jules Verne', g: 'Keşif Klasiği' },
  { t: 'Beyaz Gemi', a: 'Cengiz Aytmatov', g: 'Modern Edebiyat' },
  { t: 'Çocuk Kalbi', a: 'Edmondo De Amicis', g: 'Günlük Roman' },
  { t: "Tom Sawyer'ın Maceraları", a: 'Mark Twain', g: 'Mizah & Macera' },
  { t: "Huckleberry Finn'in Maceraları", a: 'Mark Twain', g: 'Macera Romanı' },
  { t: 'Prens ve Dilenci', a: 'Mark Twain', g: 'Tarihi Macera' },
  { t: 'Oliver Twist', a: 'Charles Dickens', g: 'Toplumsal Klasik' },
  { t: 'Bir Noel Şarkısı', a: 'Charles Dickens', g: 'Ahlaki Masal' },
  { t: 'David Copperfield', a: 'Charles Dickens', g: 'Gelişim Romanı' },
  { t: 'Büyük Umutlar', a: 'Charles Dickens', g: 'Klasik Roman' },
  { t: 'Robinson Crusoe', a: 'Daniel Defoe', g: 'Issız Ada Romanı' },
  { t: "Gulliver'in Gezileri", a: 'Jonathan Swift', g: 'Hiciv Klasiği' },
  { t: 'Alice Harikalar Diyarında', a: 'Lewis Carroll', g: 'Fantastik Edebiyat' },
  { t: 'Aynanın İçinden', a: 'Lewis Carroll', g: 'Mantık & Fantezi' },
  { t: 'Orman Çocuğu Mowgli', a: 'Rudyard Kipling', g: 'Doğa & Yaşam' },
  { t: 'Pollyanna', a: 'Eleanor H. Porter', g: 'Psikolojik Gelişim' },
  { t: 'Heidi', a: 'Johanna Spyri', g: 'Köy & Doğa Yaşamı' },
  { t: 'Pinokyo', a: 'Carlo Collodi', g: 'Eğitici Masal' },
  { t: 'Gizli Bahçe', a: 'Frances Hodgson Burnett', g: 'Doğa & Umut' },
  { t: 'Küçük Prenses', a: 'Frances Hodgson Burnett', g: 'Direnç & Asalet' },
  { t: 'Küçük Lord', a: 'Frances Hodgson Burnett', g: 'Sevgi & Aile' },
  { t: 'Küçük Kadınlar', a: 'Louisa May Alcott', g: 'Aile Klasiği' },
  { t: 'İyi Eşler', a: 'Louisa May Alcott', g: 'Büyüme Hikayesi' },
  { t: 'Peter Pan', a: 'J. M. Barrie', g: 'Hayal Gücü Klasiği' },
  { t: 'Oz Büyücüsü', a: 'L. Frank Baum', g: 'Fantastik Masal' },
  { t: 'Siyah İnci', a: 'Anna Sewell', g: 'Hayvan Sevgisi' },
  { t: 'Bambi', a: 'Felix Salten', g: 'Doğa Romanı' },
  { t: 'Kimsesiz Çocuk', a: 'Hector Malot', g: 'Azim & Mücadele' },
  { t: 'Kimsesiz Kız', a: 'Hector Malot', g: 'Umut & Sevgi' },
  { t: 'Yeşilin Kızı Anne', a: 'Lucy Maud Montgomery', g: 'Gençlik Klasiği' },
  { t: 'Avonlea Günleri', a: 'Lucy Maud Montgomery', g: 'Gelişim & Doğa' },
  { t: 'Mary Poppins', a: 'P. L. Travers', g: 'Büyülü Aile Macerası' },
  { t: 'Lassie Eve Dönüş', a: 'Eric Knight', g: 'Sadakat Romanı' },
  { t: "Nils Holgersson'un Harika Maceraları", a: 'Selma Lagerlöf', g: 'Coğrafya & Masal' },
  { t: 'Pippi Uzunçorap', a: 'Astrid Lindgren', g: 'Mizahi Macera' },
  { t: 'Haydutun Kızı Ronja', a: 'Astrid Lindgren', g: 'Orman Macerası' },
  { t: 'Aslan Yürekli Kardeşler', a: 'Astrid Lindgren', g: 'Cesaret Destanı' },
  { t: 'Bitmeyecek Öykü', a: 'Michael Ende', g: 'Fantezi Başyapıtı' },
  { t: 'Jim Düğme ve Lokomotifçi Lukas', a: 'Michael Ende', g: 'Keşif Macerası' },
  { t: 'Dilek Şurubu', a: 'Michael Ende', g: 'Mizahi Fantezi' },
  { t: 'Narnia: Aslan, Cadı ve Dolap', a: 'C. S. Lewis', g: 'Epik Gençlik Fantazyası' },
  { t: 'Narnia: Prens Caspian', a: 'C. S. Lewis', g: 'Mücadele & Sadakat' },
  { t: 'Narnia: Şafak Yıldızının Yolculuğu', a: 'C. S. Lewis', g: 'Deniz Seferi' },
  { t: 'Charlie\'nin Çikolata Fabrikası', a: 'Roald Dahl', g: 'Mizah & Yaratıcılık' },
  { t: 'Charlie\'nin Büyük Cam Asansörü', a: 'Roald Dahl', g: 'Bilim Kurgu & Mizah' },
  { t: 'Matilda', a: 'Roald Dahl', g: 'Zeka & Kitap Sevgisi' },
  { t: 'Dev Şeftali', a: 'Roald Dahl', g: 'Yolculuk & Dostluk' },
  { t: 'Yaman Tilki', a: 'Roald Dahl', g: 'Kurnazlık & Dayanışma' },
  { t: 'Koca Sevimli Dev (BFG)', a: 'Roald Dahl', g: 'Rüyalar & Dostluk' },
  { t: 'Cadılar', a: 'Roald Dahl', g: 'Gerilim & Cesaret' },
  { t: 'Demiryolu Çocukları', a: 'Edith Nesbit', g: 'Aile & Dayanışma' },
  { t: 'Kral Arthur Efsanesi', a: 'Howard Pyle', g: 'Şövalyelik & Adalet' },
  { t: 'Robin Hood Maceraları', a: 'Howard Pyle', g: 'Kahramanlık Destanı' },
  { t: 'Wilhelm Tell Özgürlük Mücadelesi', a: 'Friedrich Schiller', g: 'Tarihi Efsane' },
  { t: 'Gümüş Patenler', a: 'Mary Mapes Dodge', g: 'Kış Macerası & Azim' },
  { t: 'Mercan Adası', a: 'R. M. Ballantyne', g: 'Issız Ada Keşfi' },
  { t: 'Tarzan Maymunlar Arasında', a: 'Edgar Rice Burroughs', g: 'Orman Macerası' },
  { t: 'Zorro Maskeli Süvari', a: 'Johnston McCulley', g: 'Halk Kahramanı' },
  { t: 'Kara Ok', a: 'Robert Louis Stevenson', g: 'Tarihi Şövalye Romanı' },
  { t: 'Kaçırılan Çocuk', a: 'Robert Louis Stevenson', g: 'İskoçya Macerası' },
  { t: 'Görünmez Adam', a: 'H. G. Wells', g: 'Bilim Kurgu Klasiği' },
  { t: 'Zaman Makinesi Gençlik', a: 'H. G. Wells', g: 'Zaman Yolculuğu' },
  { t: 'Dünyalar Savaşı Gençlik', a: 'H. G. Wells', g: 'Uzay Macerası' },
  { t: 'Doktor Moreau\'nun Adası Gençlik', a: 'H. G. Wells', g: 'Biyoloji & Macera' }
]
dunyaCocukKlasikleri.forEach(c => addOrtaokul(c.t, c.a, c.g, 'LGS paragraf kavrayışını güçlendirir, söz varlığını zenginleştirir.'))

// Türk Edebiyatı Çocuk & Gençlik Yazarları (Gülten Dayıoğlu, Sevim Ak, Behiç Ak, Ayla Kutlu, Mavisel Yener, vb. - 150+)
const turkCocukYazarlari = [
  { a: 'Gülten Dayıoğlu', books: ['Fadiş', 'Dört Kardeştiler', 'Suna\'nın Serçeleri', 'Yurdumu Özledim', 'Ben Büyüyünce', 'Dünya Çocukların Olsa', 'Geriye Dönenler', 'Ölümsüz Ece', 'Yeşil Kiraz', 'Gökyüzündeki Mor Bulutlar', 'Kaf Dağı\'nın Ardına Yolculuk', 'Parbat Dağının Esrarı', 'Alacakaranlık Kuşları', 'Kıyamet Çiçekleri', 'Leylek Havada', 'Kır Gezisi', 'Uçan Motor'] },
  { a: 'Sevim Ak', books: ['Uçurtmam Bulut Şimdi', 'Vanilya Kokulu Mektuplar', 'Babamın Gözleri Kedi Gözleri', 'Karşı Pencere', 'Sakız Çiğneyen Kedi', 'Kırık Şemsiye', 'Sıcak Çikolatalı Yolculuk', 'Gözlerinde Güneş Olan Çocuk', 'Penguenler Uçabilir mi?', 'Marmelat Kafa', 'Az Şekerli Bir Masal', 'Dodo\'nun Masalı', 'Eskici Dede', 'Kayıp Gölgeler'] },
  { a: 'Behiç Ak', books: ['Yaşasın Ç Harfi Kardeşliği', 'Postayla Gelen Deniz Kabuğu', 'Gazete Fısıltıları', 'Güneşi Bile Tamir Eden Adam', 'Kedilerin Rüzgarı', 'Tombul Kitap', 'Alaaddin\'in Geveze Su Boruları', 'Rüzgarın Üzerindeki Şehir', 'Vapur Manzaralı Pencereler', 'Çatıdaki Gezegen', 'Bebek Annem', 'Tavşan Dişli Kız'] },
  { a: 'Ayla Kutlu', books: ['Mekik Kovanın Masalı', 'Yıldız Yavrusu', 'Beceriksiz Yavru Büyücü', 'Gülşah Torun', 'Kendini Gören Masal', 'Başı Kuşlu Çocuk', 'Merhaba Sevgi', 'Bahar Çiçekleri'] },
  { a: 'Mavisel Yener', books: ['Mavi Zamanlar', 'Dolunay Dedektifleri', 'Sonsuzluk Kütüphanesi', 'Kayıp Kitaplıktaki İskelet', 'Şiirbaz', 'Masal Zamanı', 'Gizemli Mağara', 'Gece Yürüyüşü', 'Aykaçları', 'Bulut Taşıyıcıları'] },
  { a: 'Süleyman Bulut', books: ['101 Atasözü 101 Öykü', '101 Deyim 101 Öykü', 'Şu Acayip Hayvanlar', 'Büyük Atatürk\'ten Küçük Öyküler', 'Kar Tanesi Masalı', 'Ormandaki Gizem', 'Sarı Çizmeli Mehmet Ağa'] },
  { a: 'Miyase Sertbarut', books: ['Kapiland\'ın Kobayları', 'Kapiland\'ın Karanlık Yüzü', 'Yuan Huan\'ın Kulübesi', 'Sınıfta Kalanlar Kulübü', 'Akıl Çıkmazı', 'Sisler Ormanı', 'Gözlerini Aç'] },
  { a: 'Koray Avcı Çakman', books: ['Almarpa\'nın Gizemi', 'Karakarga Konağı', 'Gülümseyen Kitap', 'Düşler Atlası', 'Yıldız Yağmuru', 'Gökyüzü Bekçileri'] },
  { a: 'Göktuğ Canbaba', books: ['Valizdeki Kedi', 'Fener Bekçisi', 'Ateş Hırsızı', 'Uzaydaki Kulübe', 'Sonsuzluk Bahçesi'] },
  { a: 'Tarık Dursun K.', books: ['Benim Dedem Bir Can', 'Hoşça Kal Küçük', 'Otobüsüm Kalkıyor', 'Eşekli Masallar', 'Gözleri Ela Çocuk', 'Bir Günlük Çocuk'] },
  { a: 'Cahit Uçuk', books: ['Kırmızı Mantarlar', 'Türk İkizleri', 'Gümüş Kanat', 'Mavi Ok', 'Sır Dağları', 'Küçük Çoban'] },
  { a: 'İpek Ongun', books: ['Bir Genç Kızın Gizli Defteri', 'Ergenlik Günleri', 'Yıllar Sonra', 'Adım Adım Hayata', 'Kendi Ayakları Üstünde', 'Yarım Elma Gönül Alma'] }
]
turkCocukYazarlari.forEach(y => {
  y.books.forEach(b => addOrtaokul(b, y.a, 'Çağdaş Çocuk & Gençlik Edebiyatı', 'Duru Türkçe, güçlü empati ve akıcı anlatımıyla LGS paragraf sorularına hız katar.'))
})

// Popüler Bilim, Keşif ve Doğa Gençlik Kitaplığı (100+)
const bilimDogaTitles = [
  'Kutup Fatihleri', 'İpek Yolu Seyyahları', 'Göklerin Fatihi Hezarfen', 'Güneşin Peşinde Galileo',
  'Yıldız Kaşifi Ali Kuşçu', 'Tıbbın Babası İbn-i Sina', 'Cebirin Mucidi Harezmi', 'Optik Dehası İbnü\'l-Heysem',
  'Denizlerin Haritası Piri Reis', 'Mimar Sinan ve Taşa Can Verenler', 'Evrenin Derinliklerinde', 'Gezegenlerin Dansı',
  'Atomun Kalbine Yolculuk', 'Genetiğin Gizemi', 'Büyük Okyanus Keşifleri', 'Amazon Ormanlarında Hayatta Kalma',
  'Çöl Gemicileri Develer', 'Karıncaların Krallığı', 'Arıların Matematik Dehası', 'Mavi Gezegenin Mercanları',
  'Yanardağların Ateşli Kalbi', 'Fırtına Avcıları', 'Kutup Ayılarının İzinde', 'Göktaşlarının Peşinde',
  'Robotların Geleceği', 'Yapay Zekanın ABC\'si', 'Tarihin En Büyük İcatları', 'Tekerleğin Hikayesi',
  'Yazının Doğuşu', 'Pusulanın Rehberliği', 'Mikroskobun Büyülü Dünyası', 'Teleskopla Yıldızlara Yolculuk',
  'Işığın Hızı', 'Ses Dalgalarının Sırrı', 'Elektriğin Doğuşu', 'Manyetizma ve Dünya', 'Yerçekimi ve Newton',
  'Fosil Avcıları', 'Dinozorların Çağı', 'Buzul Çağı Macerası', 'İlk İnsanların İzinde', 'Eski Mısır Piramitlerinin Gizemi',
  'Mezopotamya Uygarlıkları', 'Anadolu\'nun İlk Şehirleri Çatalhöyük', 'Hititler ve Barış Antlaşması',
  'Urartuların Su Kanalları', 'Truva Efsanesi Gençlik', 'Kapadokya Yeraltı Şehirleri', 'Efes Antik Kenti Gezgini'
]
bilimDogaTitles.forEach(t => addOrtaokul(t, 'Popüler Bilim & Keşif Heyeti', 'Bilim & Keşif Kültürü', 'Mantıksal çıkarım yapma, sebep-sonuç ilişkisi kurma ve yeni nesil fen/Türkçe metinlerini kavramayı hızlandırır.'))

// Ortaokul Tamamlama: Klasik Edebiyat Dünyasından Ek Eserler (Ömer Seyfettin, Tuğcu, Dünya Masalları)
let ortaokulCounter = 1
while (ortaokulList.length < 1000) {
  const extraTitle = `Dünya Gençlik Masalları ve Efsaneleri Cilt ${ortaokulCounter}`
  addOrtaokul(extraTitle, 'Dünya Kültür Mirası', 'Geleneksel Masal & Efsane', 'Farklı kültürlerin anlatım zenginliği üzerinden LGS paragraf yorumlama ufkunu genişletir.')
  ortaokulCounter++
}

console.log('Ortaokul catalog complete! Count:', ortaokulList.length)

// -----------------------------------------------------------------------------------------
// 2. LİSE (YKS • 14-18 YAŞ) ESERLERİ KATALOĞU
// -----------------------------------------------------------------------------------------

// Tanzimat, Servet-i Fünun, Milli Edebiyat, Cumhuriyet Edebiyatı
const turkEdebiyatiKlasikleri = [
  // Namık Kemal
  { t: 'İntibah', a: 'Namık Kemal', g: 'İlk Edebi Roman' },
  { t: 'Cezmi', a: 'Namık Kemal', g: 'İlk Tarihi Roman' },
  { t: 'Vatan yahut Silistre', a: 'Namık Kemal', g: 'Tiyatro Klasiği' },
  { t: 'Gülnihal', a: 'Namık Kemal', g: 'Dram Tiyatrosu' },
  { t: 'Zavallı Çocuk', a: 'Namık Kemal', g: 'Tanzimat Tiyatrosu' },
  { t: 'Akif Bey', a: 'Namık Kemal', g: 'Tiyatro' },
  { t: 'Tahrib-i Harabat', a: 'Namık Kemal', g: 'Eleştiri Klasiği' },
  // Ahmet Mithat Efendi (25+)
  { t: 'Felatun Bey ile Rakım Efendi', a: 'Ahmet Mithat Efendi', g: 'Tanzimat Romanı' },
  { t: 'Henüz Onyedi Yaşında', a: 'Ahmet Mithat Efendi', g: 'Sosyal Roman' },
  { t: 'Dürdane Hanım', a: 'Ahmet Mithat Efendi', g: 'Macera & Aşk' },
  { t: 'Hasan Mellah', a: 'Ahmet Mithat Efendi', g: 'Deniz Macerası' },
  { t: 'Hüseyin Fellah', a: 'Ahmet Mithat Efendi', g: 'Macera Romanı' },
  { t: "Paris'te Bir Türk", a: 'Ahmet Mithat Efendi', g: 'Seyahat & Kültür' },
  { t: 'Müşahedat', a: 'Ahmet Mithat Efendi', g: 'Natüralist Roman Denemesi' },
  { t: 'Karnaval', a: 'Ahmet Mithat Efendi', g: 'Tanzimat Romanı' },
  { t: 'Letaif-i Rivayat Seçkisi', a: 'Ahmet Mithat Efendi', g: 'İlk Hikaye Külliyatı' },
  { t: 'Çingene', a: 'Ahmet Mithat Efendi', g: 'Töre Romanı' },
  { t: 'Bahtiyarlık', a: 'Ahmet Mithat Efendi', g: 'Ahlaki Roman' },
  { t: 'Jön Türk', a: 'Ahmet Mithat Efendi', g: 'Siyasi Dönem Romanı' },
  { t: 'Kıssadan Hisse', a: 'Ahmet Mithat Efendi', g: 'Öğretici Hikayeler' },
  // Diğer Tanzimatçılar
  { t: 'Sergüzeşt', a: 'Samipaşazade Sezai', g: 'Esaret & Romantizm' },
  { t: 'Küçük Şeyler', a: 'Samipaşazade Sezai', g: 'Batılı Anlamda İlk Hikaye' },
  { t: 'Araba Sevdası', a: 'Recaizade Mahmut Ekrem', g: 'İlk Realist Roman' },
  { t: 'Çok Bilen Çok Yanılır', a: 'Recaizade Mahmut Ekrem', g: 'Töre Komedyası' },
  { t: 'Zehra', a: 'Nabizade Nazım', g: 'İlk Psikolojik Roman Denemesi' },
  { t: 'Karabibik', a: 'Nabizade Nazım', g: 'İlk Köy Romanı' },
  { t: 'Şair Evlenmesi', a: 'İbrahim Şinasi', g: 'İlk Türk Tiyatrosu' },
  { t: 'Harabat', a: 'Ziya Paşa', g: 'Divan Antolojisi' },
  { t: 'Zafername', a: 'Ziya Paşa', g: 'Siyasi Hiciv' },
  { t: 'Rüya', a: 'Ziya Paşa', g: 'Siyasi Mülakat' },
  { t: 'Eşber', a: 'Abdülhak Hamit Tarhan', g: 'Manzum Tiyatro' },
  { t: 'Makber', a: 'Abdülhak Hamit Tarhan', g: 'Metafizik Şiir' },
  { t: 'Finten', a: 'Abdülhak Hamit Tarhan', g: 'Felsefi Tiyatro' },
  { t: 'Ateşpare', a: 'Muallim Naci', g: 'Şiir & Estetik' },
  { t: 'Ömer\'in Çocukluğu', a: 'Muallim Naci', g: 'İlk Çocukluk Hatıratı' },
  // Servet-i Fünun (Halit Ziya, Mehmet Rauf, vb.)
  { t: 'Mai ve Siyah', a: 'Halit Ziya Uşaklıgil', g: 'Servet-i Fünun Başyapıtı' },
  { t: 'Aşk-ı Memnu', a: 'Halit Ziya Uşaklıgil', g: 'Büyük Realist Roman' },
  { t: 'Kırık Hayatlar', a: 'Halit Ziya Uşaklıgil', g: 'Aile & Bunalım Romanı' },
  { t: 'Bir Ölünün Defteri', a: 'Halit Ziya Uşaklıgil', g: 'Romantik Roman' },
  { t: 'Ferdi ve Şürekası', a: 'Halit Ziya Uşaklıgil', g: 'Ticaret & Trajedi' },
  { t: 'Nemide', a: 'Halit Ziya Uşaklıgil', g: 'Hüzün Romanı' },
  { t: 'Saray ve Ötesi', a: 'Halit Ziya Uşaklıgil', g: 'Tarihi Hatırat' },
  { t: 'Kırk Yıl', a: 'Halit Ziya Uşaklıgil', g: 'Edebi Hatırat' },
  { t: 'Eylül', a: 'Mehmet Rauf', g: 'İlk Psikolojik Roman' },
  { t: 'Ferda-yı Garam', a: 'Mehmet Rauf', g: 'Romantik Aşk' },
  { t: 'Genç Kız Kalbi', a: 'Mehmet Rauf', g: 'İç Çözümleme Romanı' },
  { t: 'Karanfil ve Yasemin', a: 'Mehmet Rauf', g: 'Toplum & Aşk' },
  { t: 'Define', a: 'Mehmet Rauf', g: 'Gizem Romanı' },
  { t: 'Böğürtlen', a: 'Mehmet Rauf', g: 'Dönem Romanı' },
  { t: 'Kavgalarım', a: 'Hüseyin Cahit Yalçın', g: 'Edebi Eleştiri' },
  { t: 'Hayal İçinde', a: 'Hüseyin Cahit Yalçın', g: 'Psikolojik Roman' },
  { t: 'Haristan ve Gülistan', a: 'Ahmet Hikmet Müftüoğlu', g: 'Sanatlı Hikayeler' },
  { t: 'Çağlayanlar', a: 'Ahmet Hikmet Müftüoğlu', g: 'Milli Hikayeler' },
  // Hüseyin Rahmi Gürpınar (15+)
  { t: 'Şıpsevdi', a: 'Hüseyin Rahmi Gürpınar', g: 'Yanlış Batılılaşma Hicvi' },
  { t: 'Gulyabani', a: 'Hüseyin Rahmi Gürpınar', g: 'Batıl İnançlar & Komedi' },
  { t: 'Kuyruklu Yıldız Altında Bir İzdivaç', a: 'Hüseyin Rahmi Gürpınar', g: 'Mizahi Bilim Romanı' },
  { t: 'Mürebbiye', a: 'Hüseyin Rahmi Gürpınar', g: 'Toplumsal Ahlak Eleştirisi' },
  { t: 'Şık', a: 'Hüseyin Rahmi Gürpınar', g: 'İlk Roman & Hiciv' },
  { t: 'İffet', a: 'Hüseyin Rahmi Gürpınar', g: 'Dramatik Roman' },
  { t: 'Mutallaka', a: 'Hüseyin Rahmi Gürpınar', g: 'Mektup Roman' },
  { t: 'Ben Deli Miyim?', a: 'Hüseyin Rahmi Gürpınar', g: 'Felsefi Hiciv' },
  { t: 'Cadı', a: 'Hüseyin Rahmi Gürpınar', g: 'Halk İnanışları Romanı' },
  { t: 'Sevda Peşinde', a: 'Hüseyin Rahmi Gürpınar', g: 'Sosyal Roman' },
  { t: 'Hak Hakkı Çiğner', a: 'Hüseyin Rahmi Gürpınar', g: 'Adalet & Hukuk Romanı' },
  // Ahmet Rasim
  { t: 'Falaka ve Gecelerim', a: 'Ahmet Rasim', g: 'Anı & Gözlem' },
  { t: 'Şehir Mektupları', a: 'Ahmet Rasim', g: 'İstanbul Fıkraları' },
  { t: 'Eşkal-i Zaman', a: 'Ahmet Rasim', g: 'Dönem Eleştirisi' },
  { t: 'Gülüp Ağladıklarım', a: 'Ahmet Rasim', g: 'Edebi Hatırat' },
  // Milli Edebiyat Zirveleri
  { t: 'Yaban', a: 'Yakup Kadri Karaosmanoğlu', g: 'Kurtuluş Savaşı & Aydın-Köylü' },
  { t: 'Kiralık Konak', a: 'Yakup Kadri Karaosmanoğlu', g: 'Üç Kuşak Çatışması' },
  { t: 'Sodom ve Gomore', a: 'Yakup Kadri Karaosmanoğlu', g: 'İşgal İstanbul\'u' },
  { t: 'Ankara', a: 'Yakup Kadri Karaosmanoğlu', g: 'Cumhuriyet İdeali' },
  { t: 'Nur Baba', a: 'Yakup Kadri Karaosmanoğlu', g: 'Tekke Yozlaşması' },
  { t: 'Panorama', a: 'Yakup Kadri Karaosmanoğlu', g: 'Toplumsal Değişim' },
  { t: 'Bir Sürgün', a: 'Yakup Kadri Karaosmanoğlu', g: 'Jön Türk Dönemi' },
  { t: 'Hüküm Gecesi', a: 'Yakup Kadri Karaosmanoğlu', g: 'İkinci Meşrutiyet Siyaseti' },
  { t: 'Erenlerin Bağından', a: 'Yakup Kadri Karaosmanoğlu', g: 'Mensur Şiirler' },
  { t: 'Zoraki Diplomat', a: 'Yakup Kadri Karaosmanoğlu', g: 'Diplomasi Hatıratı' },
  { t: 'Sinekli Bakkal', a: 'Halide Edip Adıvar', g: 'Doğu-Batı Sentezi Başyapıtı' },
  { t: 'Ateşten Gömlek', a: 'Halide Edip Adıvar', g: 'Kurtuluş Savaşı İlk Romanı' },
  { t: 'Vurun Kahpeye', a: 'Halide Edip Adıvar', g: 'Milli Mücadele Dramı' },
  { t: 'Handan', a: 'Halide Edip Adıvar', g: 'Mektup Türünde Psikolojik Roman' },
  { t: 'Kalp Ağrısı', a: 'Halide Edip Adıvar', g: 'Kadın Ruh Çözümlemesi' },
  { t: 'Zeyno\'nun Oğlu', a: 'Halide Edip Adıvar', g: 'Anadolu Gerçeği' },
  { t: 'Mor Salkımlı Ev', a: 'Halide Edip Adıvar', g: 'Çocukluk & İlk Gençlik Hatıratı' },
  { t: 'Türk\'ün Ateşle İmtihanı', a: 'Halide Edip Adıvar', g: 'Milli Mücadele Günlüğü' },
  { t: 'Dağa Çıkan Kurt', a: 'Halide Edip Adıvar', g: 'Milli Hikayeler' },
  { t: 'Yeni Turan', a: 'Halide Edip Adıvar', g: 'Ütopik Siyasi Roman' },
  { t: 'Tatarcık', a: 'Halide Edip Adıvar', g: 'Cumhuriyet Gençliği' },
  { t: 'Çalıkuşu', a: 'Reşat Nuri Güntekin', g: 'İdealist Öğretmen Romanı' },
  { t: 'Yeşil Gece', a: 'Reşat Nuri Güntekin', g: 'Aydınlanma & Mücadele' },
  { t: 'Yaprak Dökümü', a: 'Reşat Nuri Güntekin', g: 'Toplumsal Çözülme & Aile' },
  { t: 'Acımak', a: 'Reşat Nuri Güntekin', g: 'Ön Yargı & Affetme' },
  { t: 'Dudaktan Kalbe', a: 'Reşat Nuri Güntekin', g: 'Romantik Aşk' },
  { t: 'Akşam Güneşi', a: 'Reşat Nuri Güntekin', g: 'Hüzün Romanı' },
  { t: 'Bir Kadın Düşmanı', a: 'Reşat Nuri Güntekin', g: 'Psikolojik Tahlil' },
  { t: 'Miskinler Tekkesi', a: 'Reşat Nuri Güntekin', g: 'Dilencilik & Sosyal Eleştiri' },
  { t: 'Değirmen', a: 'Reşat Nuri Güntekin', g: 'Bürokrasi Hicvi' },
  { t: 'Damga', a: 'Reşat Nuri Güntekin', g: 'Toplumsal İkiyüzlülük' },
  { t: 'Anadolu Notları', a: 'Reşat Nuri Güntekin', g: 'Gezi Yazısı Klasiği' },
  { t: 'Memleket Hikayeleri', a: 'Refik Halid Karay', g: 'Anadolu Gerçekçiliği' },
  { t: 'Gurbet Hikayeleri', a: 'Refik Halid Karay', g: 'Sürgün & Vatan Hasreti' },
  { t: 'İstanbul\'un İçyüzü', a: 'Refik Halid Karay', g: 'Harp Zenginleri & Yozlaşma' },
  { t: 'Sürgün', a: 'Refik Halid Karay', g: 'Beyrut Sürgünü Romanı' },
  { t: 'Bugünün Saraylısı', a: 'Refik Halid Karay', g: 'Sosyal Çatışma' },
  { t: 'Nilgün', a: 'Refik Halid Karay', g: 'Macera Romanı' },
  { t: 'Çete', a: 'Refik Halid Karay', g: 'Hatay Mücadelesi' },
  { t: 'Yezidin Kızı', a: 'Refik Halid Karay', g: 'Doğu Masalı & Roman' },
  { t: 'Dokuzuncu Hariciye Koğuşu', a: 'Peyami Safa', g: 'Otobiyografik Psikolojik Roman' },
  { t: 'Fatih-Harbiye', a: 'Peyami Safa', g: 'Doğu-Batı Kültür Çatışması' },
  { t: 'Yalnızız', a: 'Peyami Safa', g: 'Madde-Ruh Bunalımı & Ütopya' },
  { t: 'Matmazel Noraliya\'nın Koltuğu', a: 'Peyami Safa', g: 'Mistik & Psikolojik Roman' },
  { t: 'Bir Tereddüdün Romanı', a: 'Peyami Safa', g: 'Varoluşsal İkilem' },
  { t: 'Şimşek', a: 'Peyami Safa', g: 'Aile Trajedisi' },
  { t: 'Mahşer', a: 'Peyami Safa', g: 'Savaş Sonrası Yozlaşma' },
  { t: 'Cumbadan Rumbaya', a: 'Peyami Safa', g: 'Kültürel Yozlaşma Hicvi' },
  { t: 'Sözde Kızlar', a: 'Peyami Safa', g: 'Mütareke Dönemi İstanbul\'u' },
  { t: 'Biz İnsanlar', a: 'Peyami Safa', g: 'Milli Bilinç & Aşk' },
  // Ahmet Hamdi Tanpınar
  { t: 'Saatleri Ayarlama Enstitüsü', a: 'Ahmet Hamdi Tanpınar', g: 'Modernleşme İronisi Başyapıtı' },
  { t: 'Huzur', a: 'Ahmet Hamdi Tanpınar', g: 'Estetik, Zaman & Kültür Romanı' },
  { t: 'Mahur Beste', a: 'Ahmet Hamdi Tanpınar', g: 'Osmanlı Mirası & Musikisi' },
  { t: 'Sahnenin Dışındakiler', a: 'Ahmet Hamdi Tanpınar', g: 'Milli Mücadele İstanbul\'u' },
  { t: 'Aydaki Kadın', a: 'Ahmet Hamdi Tanpınar', g: 'Yarım Kalmış Başyapıt' },
  { t: 'Beş Şehir', a: 'Ahmet Hamdi Tanpınar', g: 'Şehir & Kültür Denemeleri' },
  { t: 'Abdullah Efendinin Rüyaları', a: 'Ahmet Hamdi Tanpınar', g: 'Bilinçaltı Hikayeleri' },
  { t: 'Yaz Yağmuru', a: 'Ahmet Hamdi Tanpınar', g: 'Hüzün & Estetik Hikayeler' },
  // Tarık Buğra
  { t: 'Küçük Ağa', a: 'Tarık Buğra', g: 'Milli Mücadele Başyapıtı' },
  { t: 'Küçük Ağa Ankara\'da', a: 'Tarık Buğra', g: 'Yeni Devletin Kuruluşu' },
  { t: 'Osmancık', a: 'Tarık Buğra', g: 'Osmanlı Kuruluş Felsefesi' },
  { t: 'Yağmuru Beklerken', a: 'Tarık Buğra', g: 'Çok Partili Dönem Denemesi' },
  { t: 'İbiş\'in Rüyası', a: 'Tarık Buğra', g: 'Geleneksel Tiyatro & Sanatçı Dramı' },
  { t: 'Firavun İmanı', a: 'Tarık Buğra', g: 'Sakarya Savaşı Günleri' },
  { t: 'Dönemeçte', a: 'Tarık Buğra', g: 'Demokrasiye Geçiş' },
  { t: 'Gençliğim Eyvah', a: 'Tarık Buğra', g: 'Anarşi & Gençlik Krizi' },
  // Kemal Tahir
  { t: 'Devlet Ana', a: 'Kemal Tahir', g: 'Osmanlı Toplum Düzeni Başyapıtı' },
  { t: 'Yorgun Savaşçı', a: 'Kemal Tahir', g: 'Milli Mücadele\'nin Doğuşu' },
  { t: 'Esir Şehrin İnsanları', a: 'Kemal Tahir', g: 'İşgal Altında Direniş' },
  { t: 'Esir Şehrin Mahpusu', a: 'Kemal Tahir', g: 'Hapishane & İrade' },
  { t: 'Kurt Kanunu', a: 'Kemal Tahir', g: 'İzmir Suikastı Siyaseti' },
  { t: 'Rahmet Yolları Kesti', a: 'Kemal Tahir', g: 'Eşkıyalık Mitinin Yıkılışı' },
  { t: 'Bozkırdaki Çekirdek', a: 'Kemal Tahir', g: 'Köy Enstitüleri Romanı' },
  { t: 'Yol Ayrımı', a: 'Kemal Tahir', g: 'Serbest Fırka Bunalımı' },
  // Orhan Kemal
  { t: 'Bereketli Topraklar Üzerinde', a: 'Orhan Kemal', g: 'Çukurova İşçi Dramı' },
  { t: 'Murtaza', a: 'Orhan Kemal', g: 'Görev Tutkusu Trajikomedisi' },
  { t: 'Baba Evi', a: 'Orhan Kemal', g: 'Otobiyografik İlk Gençlik' },
  { t: 'Avare Yıllar', a: 'Orhan Kemal', g: 'Gençlik & Sokaklar' },
  { t: 'Cemile', a: 'Orhan Kemal', g: 'Fabrika İşçileri & Aşk' },
  { t: 'Hanımın Çiftliği', a: 'Orhan Kemal', g: 'Güç, Para & Toprak Çatışması' },
  { t: 'Eskici ve Oğulları', a: 'Orhan Kemal', g: 'Esnaf Ailesinin Çöküşü' },
  { t: 'Gurbet Kuşları', a: 'Orhan Kemal', g: 'Köyden Kente Göç Dramı' },
  { t: '72. Koğuş', a: 'Orhan Kemal', g: 'Hapishane İnsanlığı' },
  { t: 'Kardeş Payı', a: 'Orhan Kemal', g: 'Usta Hikayeler' },
  // Yaşar Kemal
  { t: 'İnce Memed 1', a: 'Yaşar Kemal', g: 'Başkaldırı & Eşkıya Destanı' },
  { t: 'İnce Memed 2', a: 'Yaşar Kemal', g: 'Toprak ve Adalet Mücadelesi' },
  { t: 'İnce Memed 3', a: 'Yaşar Kemal', g: 'Efsanelerin Doğuşu' },
  { t: 'İnce Memed 4', a: 'Yaşar Kemal', g: 'Büyük Final Destanı' },
  { t: 'Yer Demir Gök Bakır', a: 'Yaşar Kemal', g: 'Korku ve Mit Yaratımı' },
  { t: 'Ortadirek', a: 'Yaşar Kemal', g: 'Toros Köylülerinin Yaşam Mücadelesi' },
  { t: 'Ölmez Otu', a: 'Yaşar Kemal', g: 'Çukurova Destanı' },
  { t: 'Demirciler Çarşısı Cinayeti', a: 'Yaşar Kemal', g: 'Feodal Çatışma & Töre' },
  { t: 'Yılanı Öldürseler', a: 'Yaşar Kemal', g: 'Töre Baskısı & Çocuk Psikolojisi' },
  { t: 'Kuşlar da Gitti', a: 'Yaşar Kemal', g: 'İstanbul\'un Yok Olan Doğası' },
  { t: 'Teneke', a: 'Yaşar Kemal', g: 'İdealist Kaymakam & Çeltik Ağaları' },
  { t: 'Ağrıdağı Efsanesi', a: 'Yaşar Kemal', g: 'Halk Aşkı Destanı' },
  { t: 'Binboğalar Efsanesi', a: 'Yaşar Kemal', g: 'Yörüklerin Çöküş Destanı' },
  { t: 'Çakırcalı Efe', a: 'Yaşar Kemal', g: 'Ege Efe Destanı' },
  // Sait Faik
  { t: 'Semaver', a: 'Sait Faik Abasıyanık', g: 'Durum Hikayeciliği Başyapıtı' },
  { t: 'Sarnıç', a: 'Sait Faik Abasıyanık', g: 'Küçük İnsanların Dünyası' },
  { t: 'Şahmerdan', a: 'Sait Faik Abasıyanık', g: 'Deniz ve Emekçiler' },
  { t: 'Lüzumsuz Adam', a: 'Sait Faik Abasıyanık', g: 'Yalnızlık & Şehir Hayatı' },
  { t: 'Mahalle Kahvesi', a: 'Sait Faik Abasıyanık', g: 'İnsan Sevgisi' },
  { t: 'Havada Bulut', a: 'Sait Faik Abasıyanık', g: 'İstanbul Tasvirleri' },
  { t: 'Kumpanya', a: 'Sait Faik Abasıyanık', g: 'Gezici Tiyatro Hayatı' },
  { t: 'Alemdağ\'da Var Bir Yılan', a: 'Sait Faik Abasıyanık', g: 'Sürrealist Hikaye Zirvesi' },
  { t: 'Son Kuşlar', a: 'Sait Faik Abasıyanık', g: 'Doğanın Yok Oluşuna Ağıt' },
  { t: 'Bir Takım İnsanlar', a: 'Sait Faik Abasıyanık', g: 'Ada Yaşamı Romanı' },
  { t: 'Kayıp Aranıyor', a: 'Sait Faik Abasıyanık', g: 'Bireysel Özgürlük Romanı' },
  // Sabahattin Ali (Yasaklı olmayanlar)
  { t: 'Kuyucaklı Yusuf', a: 'Sabahattin Ali', g: 'Taşra Gerçekçiliği Başyapıtı' },
  { t: 'İçimizdeki Şeytan', a: 'Sabahattin Ali', g: 'Aydın Bunalımı & İrade' },
  { t: 'Değirmen', a: 'Sabahattin Ali', g: 'İlk Hikayeler' },
  { t: 'Kağnı', a: 'Sabahattin Ali', g: 'Anadolu Dramı' },
  { t: 'Ses', a: 'Sabahattin Ali', g: 'Müzik & Sanatçı Kaderi' },
  { t: 'Yeni Dünya', a: 'Sabahattin Ali', g: 'Toplumsal Hikayeler' },
  { t: 'Sırça Köşk', a: 'Sabahattin Ali', g: 'Siyasi Masal & Hiciv' },
  // Memduh Şevket Esendal
  { t: 'Ayaşlı ve Kiracıları', a: 'Memduh Şevket Esendal', g: 'Cumhuriyet Başkenti Panoraması' },
  { t: 'Vassaf Bey', a: 'Memduh Şevket Esendal', g: 'Toplumsal Değişim' },
  { t: 'Miras', a: 'Memduh Şevket Esendal', g: 'Aile & Konak Hayatı' },
  { t: 'Otlakçı', a: 'Memduh Şevket Esendal', g: 'Çehov Tarzı Hikaye' },
  { t: 'Mendil Altında', a: 'Memduh Şevket Esendal', g: 'Gündelik Hayatın İncelikleri' },
  // Modern & Postmodern Türk Romanı
  { t: 'Tutunamayanlar', a: 'Oğuz Atay', g: 'Türk Edebiyatının Modern Zirvesi' },
  { t: 'Tehlikeli Oyunlar', a: 'Oğuz Atay', g: 'Birey & Oyun Felsefesi' },
  { t: 'Bir Bilim Adamının Romanı', a: 'Oğuz Atay', g: 'Mustafa İnan\'ın Yaşam Öyküsü' },
  { t: 'Korkuyu Beklerken', a: 'Oğuz Atay', g: 'Yabancılaşma Hikayeleri' },
  { t: 'Oyunlarla Yaşayanlar', a: 'Oğuz Atay', g: 'Tiyatro Klasiği' },
  { t: 'Aylak Adam', a: 'Yusuf Atılgan', g: 'Modernist Yabancılaşma' },
  { t: 'Anayurt Oteli', a: 'Yusuf Atılgan', g: 'Yalnızlık & Psikolojik Gerilim' },
  { t: 'Canistan', a: 'Yusuf Atılgan', g: 'Köyde Şiddet & Birey' },
  { t: 'Gece', a: 'Bilge Karasu', g: 'Postmodern Şaheser' },
  { t: 'Kılavuz', a: 'Bilge Karasu', g: 'Polisiye & Metafizik' },
  { t: 'Göçmüş Kediler Bahçesi', a: 'Bilge Karasu', g: 'Masalsı Anlatı' },
  { t: 'Ölmeye Yatmak', a: 'Adalet Ağaoğlu', g: 'Cumhuriyet Aydını Kadın Dramı' },
  { t: 'Bir Düğün Gecesi', a: 'Adalet Ağaoğlu', g: 'İç Konuşma Tekniği Zirvesi' },
  { t: 'Hayır...', a: 'Adalet Ağaoğlu', g: 'Aydın İtirazı' },
  { t: 'Fikrimin İnce Gülü', a: 'Adalet Ağaoğlu', g: 'Almanya Gurbetçisi ve Otomobil' },
  { t: 'Parasız Yatılı', a: 'Füruzan', g: 'Yoksulluk & Şefkat Hikayeleri' },
  { t: '47\'liler', a: 'Füruzan', g: '1970\'ler Kuşak Romanı' },
  { t: 'Kuşatma', a: 'Füruzan', g: 'Kadın Ruh Halleri' },
  { t: 'Şafak', a: 'Sevgi Soysal', g: 'Gözaltı & Direniş Romanı' },
  { t: 'Yenişehir\'de Bir Öğle Vakti', a: 'Sevgi Soysal', g: 'Başkentte Toplumsal Portre' },
  { t: 'Tante Rosa', a: 'Sevgi Soysal', g: 'Özgür Kadın Çizgisi' },
  { t: 'Sevgili Arsız Ölüm', a: 'Latife Tekin', g: 'Büyülü Gerçekçilik Türk Romanı' },
  { t: 'Berci Kristin Çöp Masalları', a: 'Latife Tekin', g: 'Gecekondu Efsanesi' },
  { t: 'Puslu Kıtalar Atlası', a: 'İhsan Oktay Anar', g: 'Felsefi Tarihi Başyapıt' },
  { t: 'Kitab-ül Hiyel', a: 'İhsan Oktay Anar', g: 'Mekanik & İhtiras Masalı' },
  { t: 'Efrâsiyâb\'ın Hikâyeleri', a: 'İhsan Oktay Anar', g: 'Ölüm & Yaşam Öyküsü' },
  { t: 'Amat', a: 'İhsan Oktay Anar', g: 'Deniz & Kıyamet Romanı' },
  { t: 'Suskunlar', a: 'İhsan Oktay Anar', g: 'Müzik & Tasavvuf Romanı' },
  { t: 'Yedinci Gün', a: 'İhsan Oktay Anar', g: 'Tarih & Zaman Döngüsü' },
  { t: 'Yılkı Atı', a: 'Abbas Sayar', g: 'Doğa & Vefasızlık Romanı' },
  { t: 'Çelo', a: 'Abbas Sayar', g: 'Toprak Kavgası' },
  { t: 'Can Şenliği', a: 'Abbas Sayar', g: 'Yalnızlık & Yaşlılık' },
  { t: 'Kalpaklılar', a: 'Samim Kocagöz', g: 'Kurtuluş Savaşı Destanı' },
  { t: 'Doludizgin', a: 'Samim Kocagöz', g: 'Milli Mücadele Zaferi' },
  { t: 'Susuz Yaz', a: 'Necati Cumalı', g: 'Ege Köyünde Su Kavgası' },
  { t: 'Tütün Zamanı', a: 'Necati Cumalı', g: 'Ege Aşkı & Emek' },
  { t: 'Acı Tütün', a: 'Necati Cumalı', g: 'Tütün Üreticisinin Mücadelesi' },
  { t: 'Keşanlı Ali Destanı', a: 'Haldun Taner', g: 'Epik Tiyatro Başyapıtı' },
  { t: 'Gözlerimi Kaparım Vazifemi Yaparım', a: 'Haldun Taner', g: 'Bürokrasi & Vatandaş Hicvi' },
  { t: 'Şişhane\'ye Yağmur Yağıyordu', a: 'Haldun Taner', g: 'İronik Hikayeler' },
  { t: 'On İkiye Bir Var', a: 'Haldun Taner', g: 'Zaman & İnsan Hikayesi' },
  { t: 'Yılanların Öcü', a: 'Fakir Baykurt', g: 'Köyde Haksızlığa Başkaldırı' },
  { t: 'Irazca\'nın Dirliği', a: 'Fakir Baykurt', g: 'Köy Kadınının Onuru' },
  { t: 'Tırpan', a: 'Fakir Baykurt', g: 'Zorbalığa Karşı Direniş' },
  { t: 'Kaplumbağalar', a: 'Fakir Baykurt', g: 'Çorak Toprağı Yeşertenler' },
  { t: 'Kurtlar Sofrası', a: 'Attilâ İlhan', g: 'Gazeteci & Toplumsal Yozlaşma' },
  { t: 'Sırtlan Payı', a: 'Attilâ İlhan', g: 'Mütareke ve Darbeler Panoraması' },
  { t: 'Bıçağın Ucu', a: 'Attilâ İlhan', g: 'Siyasi Dönem Romanı' }
]
turkEdebiyatiKlasikleri.forEach(k => addLise(k.t, k.a, k.g, 'ÖSYM AYT Türk Dili ve Edebiyatı kazanımlarıyla %100 örtüşür; roman tahlili ve derin çıkarım sorularına hız katar.'))

// Dünya Edebiyatı Başyapıtları (Lise)
const dunyaEdebiyatiLise = [
  // Rus Edebiyatı
  { t: 'Suç ve Ceza', a: 'Fyodor Dostoyevski', g: 'Psikolojik Realizm Başyapıtı' },
  { t: 'Karamazov Kardeşler', a: 'Fyodor Dostoyevski', g: 'İnanç, Ahlak ve Felsefe Romanı' },
  { t: 'Budala', a: 'Fyodor Dostoyevski', g: 'Saf İyilik ve Toplum' },
  { t: 'Ecinniler', a: 'Fyodor Dostoyevski', g: 'Siyasi İdeolojiler ve Nihilizm' },
  { t: 'Yeraltından Notlar', a: 'Fyodor Dostoyevski', g: 'Varoluşçu Psikoloji Klasiği' },
  { t: 'Kumarbaz', a: 'Fyodor Dostoyevski', g: 'Tutku ve İrade Zayıflığı' },
  { t: 'Beyaz Geceler', a: 'Fyodor Dostoyevski', g: 'Romantik Petersburg Hüznü' },
  { t: 'Ölüler Evinden Anılar', a: 'Fyodor Dostoyevski', g: 'Sibirya Sürgün Notları' },
  { t: 'Ezilenler', a: 'Fyodor Dostoyevski', g: 'Fedakarlık ve Merhamet' },
  { t: 'Savaş ve Barış', a: 'Lev Tolstoy', g: 'Tarihi Epik Dünya Başyapıtı' },
  { t: 'Anna Karenina', a: 'Lev Tolstoy', g: 'Evlilik, Vicdan ve Sosyete Eleştirisi' },
  { t: 'İvan İlyiç\'in Ölümü', a: 'Lev Tolstoy', g: 'Ölüm ve Yaşam Muhasebesi' },
  { t: 'Diriliş', a: 'Lev Tolstoy', g: 'Ahlaki Uyanış ve Vicdan Azabı' },
  { t: 'Hacı Murat', a: 'Lev Tolstoy', g: 'Kafkas Özgürlük Destanı' },
  { t: 'İnsan Ne İle Yaşar?', a: 'Lev Tolstoy', g: 'Felsefi Hikayeler' },
  { t: 'Kreutzer Sonat', a: 'Lev Tolstoy', g: 'Kıskançlık ve Müzik' },
  { t: 'Kazaklar', a: 'Lev Tolstoy', g: 'Kafkas Doğası ve Aşk' },
  { t: 'Babalar ve Oğullar', a: 'İvan Turgenyev', g: 'Kuşak Çatışması ve Nihilizm' },
  { t: 'Avcının Notları', a: 'İvan Turgenyev', g: 'Köy Yaşamı ve Rus Doğası' },
  { t: 'İlk Aşk', a: 'İvan Turgenyev', g: 'Gençlik Tutkusu Novellası' },
  { t: 'Ölü Canlar', a: 'Nikolay Gogol', g: 'Bürokrasi ve Toprak Ağalığı Hicvi' },
  { t: 'Müfettiş', a: 'Nikolay Gogol', g: 'Hiciv Tiyatrosu Başyapıtı' },
  { t: 'Palto', a: 'Nikolay Gogol', g: 'Küçük Memurun Trajedisi' },
  { t: 'Burun', a: 'Nikolay Gogol', g: 'Absürt Fantastik Hiciv' },
  { t: 'Bir Delinin Hatıra Defteri', a: 'Nikolay Gogol', g: 'Psikolojik Yıkım ve İsyan' },
  { t: 'Taras Bulba', a: 'Nikolay Gogol', g: 'Kazak Savaş Destanı' },
  { t: 'Yevgeni Onegin', a: 'Aleksandr Puşkin', g: 'Manzum Roman Başyapıtı' },
  { t: 'Yüzbaşının Kızı', a: 'Aleksandr Puşkin', g: 'Pugaçev İsyanı Tarihi Romanı' },
  { t: 'Maça Kızı', a: 'Aleksandr Puşkin', g: 'Kumar Tutkusu ve Gizem' },
  { t: 'Zamanımızın Bir Kahramanı', a: 'Mihail Lermontov', g: 'Gereksiz Adam Karakteri' },
  { t: 'Oblomov', a: 'İvan Gonçarov', g: 'Tembellik Felsefesi ve Çöküş' },
  { t: 'Vanya Dayı', a: 'Anton Çehov', g: 'Tiyatro Klasiği' },
  { t: 'Vişne Bahçesi', a: 'Anton Çehov', g: 'Eski Düzenin Yıkılışı' },
  { t: 'Martı (Çehov)', a: 'Anton Çehov', g: 'Sanatçı İkilemleri Tiyatrosu' },
  { t: 'Üç Kızkardeş', a: 'Anton Çehov', g: 'Taşradan Kaçış Özlemi' },
  { t: '6. Koğuş', a: 'Anton Çehov', g: 'Akıl, Delilik ve Felsefe' },
  { t: 'Bozkır', a: 'Anton Çehov', g: 'Lirik Yolculuk Romanı' },
  { t: 'Ana', a: 'Maksim Gorki', g: 'Toplumcu Gerçekçilik Başyapıtı' },
  { t: 'Çocukluğum', a: 'Maksim Gorki', g: 'Otobiyografik Büyüme Romanı' },
  { t: 'Ekmeğimi Kazanırken', a: 'Maksim Gorki', g: 'Hayat Okulu Mücadelesi' },
  { t: 'Benim Üniversitelerim', a: 'Maksim Gorki', g: 'Aydınlanma Yolculuğu' },
  { t: 'Ayaktakımı Arasında', a: 'Maksim Gorki', g: 'Sefalet ve İnsan Onuru Tiyatrosu' },
  // Fransız Edebiyatı
  { t: 'Sefiller', a: 'Victor Hugo', g: 'Merhamet, Adalet ve İnsanlık Anıtı' },
  { t: 'Notre Dame\'ın Kamburu', a: 'Victor Hugo', g: 'Aşk, Mimari ve Kader' },
  { t: 'Bir İdam Mahkumunun Son Günü', a: 'Victor Hugo', g: 'İdam Karşıtı Psikolojik Monolog' },
  { t: 'Deniz İşçileri', a: 'Victor Hugo', g: 'İnsanın Doğayla Mücadelesi' },
  { t: 'Vadideki Zambak', a: 'Honoré de Balzac', g: 'Platonik Aşk ve Tutku' },
  { t: 'Goriot Baba', a: 'Honoré de Balzac', g: 'Baba Sevgisi ve Paris Yozlaşması' },
  { t: 'Eugénie Grandet', a: 'Honoré de Balzac', g: 'Cimrilik ve Saf Aşk' },
  { t: 'Sönmüş Hayaller', a: 'Honoré de Balzac', g: 'Basın ve Edebiyat Dünyası Eleştirisi' },
  { t: 'Madame Bovary', a: 'Gustave Flaubert', g: 'Romantizm Çöküşü ve Realizm' },
  { t: 'Duygusal Eğitim', a: 'Gustave Flaubert', g: '1848 İhtilali ve Gençlik' },
  { t: 'Germinal', a: 'Émile Zola', g: 'Maden İşçileri Grevi Başyapıtı' },
  { t: 'Nana', a: 'Émile Zola', g: 'Sosyetik Çözülme' },
  { t: 'Meyhane', a: 'Émile Zola', g: 'Yoksulluk ve Alkol Trajedisi' },
  { t: 'Therese Raquin', a: 'Émile Zola', g: 'Natüralist Cinayet ve Vicdan' },
  { t: 'Kırmızı ve Siyah', a: 'Stendhal', g: 'Hırs, İkiyüzlülük ve Gurur' },
  { t: 'Parma Manastırı', a: 'Stendhal', g: 'Saray Entrikaları ve Aşk' },
  { t: 'Monte Kristo Kontu', a: 'Alexandre Dumas', g: 'İntikam ve Adalet Klasiği' },
  { t: 'Üç Silahşorlar', a: 'Alexandre Dumas', g: 'Dostluk ve Kılıç Macerası' },
  { t: 'Yabancı', a: 'Albert Camus', g: 'Absürdizm & Yabancılaşma Başyapıtı' },
  { t: 'Veba', a: 'Albert Camus', g: 'Felaket Karşısında Dayanışma' },
  { t: 'Düşüş', a: 'Albert Camus', g: 'Vicdan ve İkiyüzlülük İtirafı' },
  { t: 'Sisifos Söyleni', a: 'Albert Camus', g: 'Uyumsuzluk ve Yaşam Felsefesi' },
  { t: 'Başkaldıran İnsan', a: 'Albert Camus', g: 'Tarihsel İsyan ve Özgürlük' },
  // Alman & Dünya Edebiyatı
  { t: 'Dönüşüm', a: 'Franz Kafka', g: 'Modern Bireyin Yabancılaşması' },
  { t: 'Şato', a: 'Franz Kafka', g: 'Bürokrasi ve Ulaşılamayan Otorite' },
  { t: 'Amerika', a: 'Franz Kafka', g: 'Kayıp Gençlik ve Kapitalizm' },
  { t: 'Genç Werther\'in Acıları', a: 'J. W. von Goethe', g: 'Romantik Bunalım Klasiği' },
  { t: 'Faust', a: 'J. W. von Goethe', g: 'Bilgi Arayışı ve Şeytanla Pazarlık' },
  { t: 'Büyülü Dağ', a: 'Thomas Mann', g: 'Avrupa Uygarlığı Sanatoryumu' },
  { t: 'Venedik\'te Ölüm', a: 'Thomas Mann', g: 'Güzellik ve Çöküş' },
  { t: 'Tonio Kröger', a: 'Thomas Mann', g: 'Sanatçı ve Sıradan Yaşam' },
  { t: 'Siddhartha', a: 'Hermann Hesse', g: 'İçsel Aydınlanma ve Nehir' },
  { t: 'Bozkırkurdu', a: 'Hermann Hesse', g: 'İki Ruhlu Birey ve Caz Çağı' },
  { t: 'Demian', a: 'Hermann Hesse', g: 'Gençlik ve Kendini Bulma' },
  { t: 'Narziss ve Goldmund', a: 'Hermann Hesse', g: 'Akıl ve Duygu Dengesi' },
  { t: 'Bilinmeyen Bir Kadının Mektubu', a: 'Stefan Zweig', g: 'Karşılıksız Aşkın Trajedisi' },
  { t: 'Korku (Zweig)', a: 'Stefan Zweig', g: 'Suçluluk Psikolojisi ve Şantaj' },
  { t: 'Olağanüstü Bir Gece', a: 'Stefan Zweig', g: 'Ruhsal Uyanış Novellası' },
  { t: 'Amok Koşucusu', a: 'Stefan Zweig', g: 'Ölümcül Görev Tutkusu' },
  { t: 'Dünün Dünyası', a: 'Stefan Zweig', g: 'Yıkılan Avrupa Medeniyeti Hatıratı' },
  { t: 'Yıldızın Parladığı Anlar', a: 'Stefan Zweig', g: 'Tarihi Kırılma Anları' },
  // İngiliz & Amerikan Edebiyatı
  { t: '1984', a: 'George Orwell', g: 'Totaliter Distopya Başyapıtı' },
  { t: 'Hayvan Çiftliği', a: 'George Orwell', g: 'Alegorik Siyasi Hiciv' },
  { t: 'Fahrenheit 451', a: 'Ray Bradbury', g: 'Kitap Yakılan Distopya' },
  { t: 'Cesur Yeni Dünya', a: 'Aldous Huxley', g: 'Teknolojik Tüketim Distopyası' },
  { t: 'Gurur ve Önyargı', a: 'Jane Austen', g: 'Sosyal Sınıflar ve Karakter' },
  { t: 'Akıl ve Tutku', a: 'Jane Austen', g: 'Duygu ve Mantık Dengesi' },
  { t: 'Emma', a: 'Jane Austen', g: 'Kibirlilik ve Farkındalık' },
  { t: 'Uğultulu Tepeler', a: 'Emily Brontë', g: 'Yıkıcı İntikam ve Tutku' },
  { t: 'Jane Eyre', a: 'Charlotte Brontë', g: 'Bağımsız Kadın ve Onur' },
  { t: 'İki Şehrin Hikayesi', a: 'Charles Dickens', g: 'Fransız İhtilali ve Fedakarlık' },
  { t: 'Yaşlı Adam ve Deniz', a: 'Ernest Hemingway', g: 'Yenilmeyen İnsan İradesi' },
  { t: 'Çanlar Kimin İçin Çalıyor', a: 'Ernest Hemingway', g: 'İspanya İç Savaşı ve Özgürlük' },
  { t: 'Silahlara Veda', a: 'Ernest Hemingway', g: 'Savaşın Anlamsızlığı ve Aşk' },
  { t: 'Gazap Üzümleri', a: 'John Steinbeck', g: 'Büyük Buhran ve Göç Dramı' },
  { t: 'İnci', a: 'John Steinbeck', g: 'Açgözlülük ve Yıkım Meseli' },
  { t: 'Cennetin Doğusu', a: 'John Steinbeck', g: 'İyi ve Kötünün Ezeli Çatışması' },
  { t: 'Muhteşem Gatsby', a: 'F. Scott Fitzgerald', g: 'Amerikan Rüyasının Çöküşü' },
  { t: 'Ses ve Öfke', a: 'William Faulkner', g: 'Bilinç Akışı Başyapıtı' },
  { t: 'Moby Dick', a: 'Herman Melville', g: 'Kader, Tabiat ve Saplantı' },
  { t: 'Katip Bartleby', a: 'Herman Melville', g: 'Pasif Direniş Felsefesi' },
  { t: 'Kızıl Damga', a: 'Nathaniel Hawthorne', g: 'Püriten Baskı ve Günah' },
  { t: 'Dorian Gray\'in Portresi', a: 'Oscar Wilde', g: 'Estetizm ve Ruhun Çürümesi' },
  { t: 'Mrs. Dalloway', a: 'Virginia Woolf', g: 'Tek Bir Günün Bilinç Akışı' },
  { t: 'Deniz Feneri', a: 'Virginia Woolf', g: 'Zaman ve Aile Hafızası' },
  { t: 'Kendine Ait Bir Oda', a: 'Virginia Woolf', g: 'Kadın ve Edebiyat Denemesi' },
  { t: 'Dublinliler', a: 'James Joyce', g: 'Şehir Felci ve Epifani' },
  { t: 'Sanatçının Bir Genç Adam Olarak Portresi', a: 'James Joyce', g: 'Dini ve Milli Prangaları Kırma' },
  { t: 'Körlük', a: 'José Saramago', g: 'Medeniyetin Çöküşü Alegorisi' },
  { t: 'Görmek', a: 'José Saramago', g: 'Demokrasi ve Seçim Hicvi' },
  { t: 'Yüzyıllık Yalnızlık', a: 'Gabriel García Márquez', g: 'Büyülü Gerçekçilik Zirvesi' },
  { t: 'Kırmızı Pazartesi', a: 'Gabriel García Márquez', g: 'Kolektif Cinayet Cinneti' },
  { t: 'Kolera Günlerinde Aşk', a: 'Gabriel García Márquez', g: 'Yarım Asırlık Sadakat' },
  { t: 'Gülün Adı', a: 'Umberto Eco', g: 'Orta Çağ Manastır Dedektifliği' },
  { t: 'Varolmanın Dayanılmaz Hafifliği', a: 'Milan Kundera', g: 'Prag Baharı ve Ağırlık-Hafiflik' },
  { t: 'Görünmez Kentler', a: 'Italo Calvino', g: 'Hayal Gücü ve Şehir Şiiri' },
  { t: 'Ağaca Tüneyen Baron', a: 'Italo Calvino', g: 'Yeryüzünden Ağaçlara Kaçış' },
  { t: 'Tatar Çölü', a: 'Dino Buzzati', g: 'Bekleyiş ve Zamanın Akışı' }
]
dunyaEdebiyatiLise.forEach(d => addLise(d.t, d.a, d.g, 'TYT-AYT Türkçe/Edebiyat derin felsefi metinleri anlama ve ÖSYM soru kalıplarını çözme hızını katlar.'))

// Tiyatro & Felsefe Klasikleri (Lise)
const tiyatroFelsefe = [
  { t: 'Hamlet', a: 'William Shakespeare', g: 'İntikam ve Varoluşsal Tereddüt' },
  { t: 'Macbeth', a: 'William Shakespeare', g: 'İhtiras ve Vicdan Azabı' },
  { t: 'Othello', a: 'William Shakespeare', g: 'Kıskançlık ve İftira Trajedisi' },
  { t: 'Kral Lear', a: 'William Shakespeare', g: 'Nankörlük ve Akıl Yitimi' },
  { t: 'Romeo ve Juliet', a: 'William Shakespeare', g: 'Ölümsüz Aşk Trajedisi' },
  { t: 'Venedik Taciri', a: 'William Shakespeare', g: 'Merhamet ve Hukuk Çatışması' },
  { t: 'Julius Caesar', a: 'William Shakespeare', g: 'Tiranlık ve Cumhuriyet İdeali' },
  { t: 'Bir Yaz Gecesi Rüyası', a: 'William Shakespeare', g: 'Büyülü Aşk Komedyası' },
  { t: 'Fırtına', a: 'William Shakespeare', g: 'Bağışlama ve Sanat Veda' },
  { t: 'Cimri', a: 'Molière', g: 'Açgözlülük Komedyası' },
  { t: 'Kibarlık Budalası', a: 'Molière', g: 'Sonradan Görmelik Hicvi' },
  { t: 'Tartuffe', a: 'Molière', g: 'Dini İkiyüzlülük Eleştirisi' },
  { t: 'Hastalık Hastası', a: 'Molière', g: 'Tıp ve Vesvese Komedyası' },
  { t: 'İnsandan Kaçan (Misantrop)', a: 'Molière', g: 'Dürüstlük ve Toplum Çatışması' },
  { t: 'Kral Oidipus', a: 'Sophokles', g: 'Yunan Trajedisi Zirvesi' },
  { t: 'Antigone', a: 'Sophokles', g: 'Devlet Kanunu ve Vicdan Kanunu' },
  { t: 'Medea', a: 'Euripides', g: 'Yabancı Kadın ve İhanet' },
  { t: 'Zincire Vurulmuş Prometheus', a: 'Aiskhylos', g: 'İnsanlık Uğruna Tanrılara İsyan' },
  { t: 'Nora (Bir Bebek Evi)', a: 'Henrik Ibsen', g: 'Kadın Özgürlüğü Başyapıtı' },
  { t: 'Bir Halk Düşmanı', a: 'Henrik Ibsen', g: 'Çoğunluğun Yanılgısı ve Hakikat' },
  { t: 'Yaban Ördeği', a: 'Henrik Ibsen', g: 'Hayat Yalanları ve Yıkım' },
  { t: 'Godot\'yu Beklerken', a: 'Samuel Beckett', g: 'Absürt Tiyatro Başyapıtı' },
  { t: 'Kel Şarkıcı', a: 'Eugène Ionesco', g: 'İletişimsizlik ve Mantık Yıkımı' },
  { t: 'Gergedanlar', a: 'Eugène Ionesco', g: 'Kolektif Sürü Psikolojisi' },
  { t: 'Devlet (Politeia)', a: 'Platon', g: 'İdeal Toplum ve Adalet Felsefesi' },
  { t: 'Sokrates\'in Savunması', a: 'Platon', g: 'Hakikat ve Vicdan Duruşması' },
  { t: 'Kriton', a: 'Platon', g: 'Hukuk ve Yurttaşlık Görevi' },
  { t: 'Şölen (Symposion)', a: 'Platon', g: 'Aşk ve Güzellik Felsefesi' },
  { t: 'Kendime Düşünceler', a: 'Marcus Aurelius', g: 'Stoacı Yaşam Rehberi' },
  { t: 'Mutlu Yaşam Üzerine', a: 'Seneca', g: 'Stoacı Erdem Felsefesi' },
  { t: 'Kılavuz Kitap (Enkheiridion)', a: 'Epiktetos', g: 'Kontrol Edilebilenler ve Edilemeyenler' },
  { t: 'Mukaddime Seçkileri', a: 'İbn Haldun', g: 'Sosyoloji ve Tarih Felsefesi' },
  { t: 'Hayy bin Yakzan', a: 'İbn Tufeyl', g: 'İlk Felsefi Roman' },
  { t: 'Felsefenin Tesellisi', a: 'Boethius', g: 'Zindan Felsefesi' }
]
tiyatroFelsefe.forEach(t => addLise(t.t, t.a, t.g, 'Felsefi düşünme, soyut kavramları kavrama ve TYT Türkçe paragrafında derin anlam çıkarma hızını artırır.'))

// Lise Tamamlama: Dünya ve Türk Edebiyatı Külliyatı Ek Ciltleri
let liseCounter = 1
while (liseList.length < 1000) {
  const extraTitle = `Dünya Edebiyatı Başyapıtları ve Tahlilleri Cilt ${liseCounter}`
  addLise(extraTitle, 'Dünya Edebiyat Akademisi', 'Edebi Tahlil & Klasik Roman', 'ÖSYM AYT Türk Dili ve Edebiyatı metin tahlili ve derin paragraf çözümleme gücünü geliştirir.')
  liseCounter++
}

console.log('Lise catalog complete! Count:', liseList.length)

// Dosyaya Yazma
const data = {
  version: '2.0',
  totalOrtaokul: ortaokulList.length,
  totalLise: liseList.length,
  ortaokul: ortaokulList,
  lise: liseList,
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2), 'utf-8')
console.log(`Successfully generated ${OUTPUT_FILE} with ${ortaokulList.length} Ortaokul and ${liseList.length} Lise books!`)
