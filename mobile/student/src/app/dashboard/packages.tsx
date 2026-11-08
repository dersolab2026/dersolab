import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '@/lib/supabase';

interface PackageItem {
  id: string;
  title: string;
  description: string | null;
  creditAmount: number;
  price: number;
  shopierProductUrl: string | null;
}

interface PurchaseHistoryItem {
  id: string;
  creditsGranted: number;
  amountPaid: number;
  status: string;
  createdAt: string;
}

const DEFAULT_PACKAGES: PackageItem[] = [
  {
    id: 'd004ab70-4b43-43b6-b5ee-f3b01d605efa',
    title: 'Tek Ders Paketi',
    description: '1 ders kredisi. 40 dakikalık birebir canlı derse karşılık gelir.',
    creditAmount: 1,
    price: 1000,
    shopierProductUrl: 'https://www.shopier.com/49759946',
  },
  {
    id: '55014120-f6af-474f-9d15-0cd569777e97',
    title: '5+1 Ders Paketi',
    description: '5 ders kredisi al, 1 ders kredisi hediye kazan. Toplam 6 kredi.',
    creditAmount: 6,
    price: 5000,
    shopierProductUrl: 'https://www.shopier.com/49778331',
  },
  {
    id: '6ba6d54f-4f52-4a68-a5f0-df5b32438603',
    title: '10+2 Ders Paketi',
    description: '10 ders kredisi al, 2 ders kredisi hediye kazan. Toplam 12 kredi.',
    creditAmount: 12,
    price: 10000,
    shopierProductUrl: 'https://www.shopier.com/49778326',
  },
];

export default function StudentPackagesScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [creditBalance, setCreditBalance] = useState(0);
  const [lessonCount, setLessonCount] = useState(0);
  const [lessonCreditsUsed, setLessonCreditsUsed] = useState(0);
  const [guidanceCount, setGuidanceCount] = useState(0);
  const [guidanceCreditsUsed, setGuidanceCreditsUsed] = useState(0);

  // Hoş Geldin Paketi (Ücretsiz Tanışma Dersi)
  const [freeTrialUsed, setFreeTrialUsed] = useState(false);
  const [demoRequestStatus, setDemoRequestStatus] = useState<'pending' | 'assigned' | 'cancelled' | null>(null);
  const [requestingDemo, setRequestingDemo] = useState(false);

  // Paketler & Geçmiş Alımlar
  const [packages, setPackages] = useState<PackageItem[]>(DEFAULT_PACKAGES);
  const [purchases, setPurchases] = useState<PurchaseHistoryItem[]>([]);

  const loadData = useCallback(async () => {
    try {
      // 1. Aktif paketleri her zaman çek (oturum olmasa da herkes görebilir)
      const { data: pkgRows } = await supabase
        .from('packages')
        .select('id, title, description, credit_amount, price, shopier_product_url')
        .eq('is_active', true)
        .order('credit_amount', { ascending: true });

      if (pkgRows && pkgRows.length > 0) {
        setPackages(
          pkgRows.map((r: any) => ({
            id: r.id,
            title: r.title,
            description: r.description,
            creditAmount: r.credit_amount,
            price: Number(r.price),
            shopierProductUrl: r.shopier_product_url,
          }))
        );
      }

      // 2. Oturum varsa öğrenciye özel kredi ve geçmiş verilerini çek
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setIsLoggedIn(false);
        return;
      }

      setIsLoggedIn(true);
      const uid = session.user.id;
      setUserEmail(session.user.email || '');

      const [
        { data: studentRow },
        { data: bookingsData },
        { data: demoRow },
        { data: purchaseRows },
      ] = await Promise.all([
        supabase
          .from('students')
          .select('credit_balance, free_trial_used')
          .eq('user_id', uid)
          .maybeSingle(),
        supabase
          .from('bookings')
          .select('credits_used, status, credit_refunded, session_type')
          .eq('student_id', uid),
        supabase
          .from('demo_lesson_requests')
          .select('status')
          .eq('student_id', uid)
          .eq('request_type', 'demo_lesson')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('package_purchases')
          .select('id, credits_granted, amount_paid, status, created_at')
          .eq('student_id', uid)
          .order('created_at', { ascending: false })
          .limit(10),
      ]);

      setCreditBalance(studentRow?.credit_balance ?? 0);
      setFreeTrialUsed(studentRow?.free_trial_used ?? false);
      setDemoRequestStatus((demoRow?.status as any) ?? null);

      const usedBookings = (bookingsData ?? []).filter(
        (b: any) => !(b.status === 'cancelled' && b.credit_refunded === true)
      );
      let lCount = 0;
      let lCredits = 0;
      let gCount = 0;
      let gCredits = 0;
      for (const b of usedBookings) {
        if (b.session_type === 'coaching') {
          gCount += 1;
          gCredits += b.credits_used ?? 1;
        } else {
          lCount += 1;
          lCredits += b.credits_used ?? 1;
        }
      }
      setLessonCount(lCount);
      setLessonCreditsUsed(lCredits);
      setGuidanceCount(gCount);
      setGuidanceCreditsUsed(gCredits);

      setPurchases(
        (purchaseRows ?? []).map((p: any) => ({
          id: p.id,
          creditsGranted: p.credits_granted,
          amountPaid: Number(p.amount_paid),
          status: p.status,
          createdAt: p.created_at,
        }))
      );
    } catch (e) {
      console.error('Paket verisi yükleme hatası:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleRequestDemoLesson = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      Alert.alert(
        'Giriş Gerekli',
        'Ücretsiz tanışma dersi talep edebilmek için önce öğrenci hesabınla giriş yapmalısın.',
        [
          { text: 'Vazgeç', style: 'cancel' },
          { text: 'Giriş Yap', onPress: () => router.push('/login' as any) },
        ]
      );
      return;
    }

    setRequestingDemo(true);
    try {
      const { error } = await supabase.from('demo_lesson_requests').insert({
        student_id: session.user.id,
        requested_by: session.user.id,
        request_type: 'demo_lesson',
      });

      if (error) {
        const msg = error.message || '';
        if (msg.includes('zaten kullanilmis')) {
          Alert.alert('Bilgi', 'Hoş Geldin Paketini zaten kullandın.');
        } else if (msg.includes('zaten bekleyen')) {
          Alert.alert('Bilgi', 'Zaten bekleyen bir tanışma dersi talebin var.');
        } else {
          Alert.alert('Hata', msg || 'Talep oluşturulamadı.');
        }
      } else {
        Alert.alert(
          'Talebin Alındı! 🎉',
          'Ücretsiz tanışma dersi talebin eğitmen havuzuna iletildi. Uygun bir eğitmen atandığında Derslerim sekmesinde görünecek.'
        );
        loadData();
      }
    } catch (err: any) {
      Alert.alert('Hata', err?.message || 'Bir sorun oluştu.');
    } finally {
      setRequestingDemo(false);
    }
  };

  const handleBuyPackage = async (pkg: PackageItem) => {
    if (!pkg.shopierProductUrl) {
      Alert.alert('Bilgi', 'Bu paket şu anda satın alınamıyor, lütfen bizimle iletişime geçin.');
      return;
    }

    const emailNote = userEmail
      ? `\n\n📧 Shopier ödeme formunda bu DersoLab e-postanı kullanmalısın:\n${userEmail}`
      : `\n\n⚠️ Kredilerin hesabına otomatik tanımlanması için Shopier ödeme formunda DersoLab'e kayıtlı öğrenci e-postanı kullanmalısın.`;

    Alert.alert(
      `${pkg.title} (${pkg.creditAmount} Kredi)`,
      `Ödeme güvenli Shopier sayfasında gerçekleşecektir.${emailNote}`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Shopier ile Ödemeye Geç',
          onPress: async () => {
            await WebBrowser.openBrowserAsync(pkg.shopierProductUrl!);
            loadData();
          },
        },
      ]
    );
  };

  const hasDemoOrUsed =
    freeTrialUsed || demoRequestStatus === 'pending' || demoRequestStatus === 'assigned';

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <LinearGradient colors={['#f97316', '#f59e0b']} style={styles.headerIcon}>
            <Ionicons name="wallet" size={20} color="#030712" />
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Ders Paketleri & Kredi</Text>
            <Text style={styles.headerSubtitle}>
              Kredi satın al, ücretsiz tanışma dersi talep et ve bakiyeni yönet
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f97316" />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Kredi Özeti Kartı */}
        <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>KALAN DERS KREDİN</Text>
          <View style={styles.summaryTopRow}>
            <Text style={styles.summaryBalance}>
              {creditBalance} <Text style={styles.summaryUnit}>Kredi</Text>
            </Text>
            <View style={styles.summaryBadge}>
              <Ionicons name="time-outline" size={13} color="#00e5ff" />
              <Text style={styles.summaryBadgeText}>1 Kredi = 40 Dk</Text>
            </View>
          </View>

          <View style={styles.summaryStatsRow}>
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatLabel}>Birebir Ders</Text>
              <Text style={styles.summaryStatValue}>
                {lessonCount} ders • {lessonCreditsUsed} kredi
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatLabel}>Koçluk Seansı</Text>
              <Text style={styles.summaryStatValue}>
                {guidanceCount} seans • {guidanceCreditsUsed} kredi
              </Text>
            </View>
          </View>

          {isLoggedIn && userEmail ? (
            <View style={styles.emailNoticeBox}>
              <Ionicons name="mail-outline" size={16} color="#f59e0b" />
              <Text style={styles.emailNoticeText}>
                Shopier ödemesinde kullanacağın e-posta:{' '}
                <Text style={{ color: '#ffffff', fontWeight: '800' }}>{userEmail}</Text>
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => router.push('/login' as any)}
              style={styles.loginPromptBtn}
            >
              <Ionicons name="log-in-outline" size={16} color="#00e5ff" />
              <Text style={styles.loginPromptText}>
                Kredi bakiyeni görmek için hesabına giriş yap →
              </Text>
            </TouchableOpacity>
          )}
        </LinearGradient>

        {/* 2. Aktif Ders Paketleri (En üstte hemen görünür!) */}
        <Text style={styles.sectionTitle}>Kredi Paketleri</Text>
        <Text style={styles.sectionSub}>
          Dilediğin paketi seçerek Shopier güvencesiyle anında kredi yükleyebilirsin.
        </Text>

        {loading && packages.length === 0 ? (
          <ActivityIndicator size="large" color="#f97316" style={{ marginVertical: 24 }} />
        ) : (
          packages.map((pkg) => {
            const unitPrice =
              pkg.creditAmount > 0 ? Math.round(pkg.price / pkg.creditAmount) : pkg.price;
            const isPopular = pkg.creditAmount === 6 || pkg.creditAmount === 12;

            return (
              <View
                key={pkg.id}
                style={[styles.pkgCard, isPopular && styles.pkgCardPopular]}
              >
                {pkg.creditAmount === 6 && (
                  <View style={styles.popularRibbon}>
                    <Ionicons name="star" size={11} color="#030712" />
                    <Text style={styles.popularRibbonText}>EN ÇOK TERCİH EDİLEN (+1 HEDİYE)</Text>
                  </View>
                )}
                {pkg.creditAmount === 12 && (
                  <View style={[styles.popularRibbon, { backgroundColor: '#10b981' }]}>
                    <Ionicons name="flame" size={11} color="#030712" />
                    <Text style={styles.popularRibbonText}>AVANTAJLI PAKET (+2 HEDİYE)</Text>
                  </View>
                )}

                <View style={styles.pkgTopRow}>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={styles.pkgTitle}>{pkg.title}</Text>
                    <View style={styles.pkgCreditPill}>
                      <Ionicons name="flash" size={13} color="#10b981" />
                      <Text style={styles.pkgCreditPillText}>
                        {pkg.creditAmount} Ders Kredisi
                      </Text>
                    </View>
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.pkgPrice}>
                      {pkg.price.toLocaleString('tr-TR')} ₺
                    </Text>
                    <Text style={styles.pkgUnitPrice}>Ders başı ~{unitPrice} ₺</Text>
                  </View>
                </View>

                {pkg.description ? (
                  <Text style={styles.pkgDesc}>{pkg.description}</Text>
                ) : null}

                <TouchableOpacity
                  style={[
                    styles.buyBtn,
                    !pkg.shopierProductUrl && { backgroundColor: '#334155' },
                  ]}
                  onPress={() => handleBuyPackage(pkg)}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name="card-outline"
                    size={18}
                    color="#030712"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.buyBtnText}>
                    {pkg.shopierProductUrl ? 'Satın Al (Shopier)' : 'Şu An Satışta Değil'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}

        {/* 3. Hoş Geldin Paketi (Ücretsiz Tanışma Dersi) */}
        <View style={styles.demoCard}>
          <View style={styles.demoHeaderRow}>
            <View style={styles.demoIconBox}>
              <Ionicons name="gift" size={20} color="#38bdf8" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.demoTitle}>Hoş Geldin Paketi (Ücretsiz Tanışma Dersi)</Text>
              <Text style={styles.demoSub}>
                Her öğrenciye 1 kez tamamen ücretsiz, kredisiz 40 dk canlı tanışma dersi.
              </Text>
            </View>
          </View>

          {hasDemoOrUsed ? (
            <View style={styles.demoStatusBox}>
              <Ionicons
                name={
                  demoRequestStatus === 'assigned' || freeTrialUsed
                    ? 'checkmark-circle'
                    : 'hourglass-outline'
                }
                size={18}
                color={
                  demoRequestStatus === 'assigned' || freeTrialUsed ? '#10b981' : '#f59e0b'
                }
              />
              <Text style={styles.demoStatusText}>
                {demoRequestStatus === 'assigned' || freeTrialUsed
                  ? 'Tanışma dersi eğitmenin atandı veya tamamlandı! Detayları Derslerim sekmesinde görebilirsin.'
                  : 'Talebin alındı! Uygun bir eğitmen tanışma dersini planladığında bildirim alacaksın.'}
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.demoBtn, requestingDemo && { opacity: 0.6 }]}
              onPress={handleRequestDemoLesson}
              disabled={requestingDemo}
              activeOpacity={0.85}
            >
              {requestingDemo ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Ionicons name="sparkles" size={16} color="#ffffff" style={{ marginRight: 8 }} />
                  <Text style={styles.demoBtnText}>Ücretsiz Tanışma Dersi Talep Et</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* 4. Geçmiş Satın Alımlar */}
        {purchases.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <Text style={styles.sectionTitle}>Son İşlemlerim</Text>
            {purchases.map((p) => (
              <View key={p.id} style={styles.historyRow}>
                <View>
                  <Text style={styles.historyTitle}>+{p.creditsGranted} Ders Kredisi</Text>
                  <Text style={styles.historyDate}>
                    {new Date(p.createdAt).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.historyAmount}>
                    {p.amountPaid.toLocaleString('tr-TR')} ₺
                  </Text>
                  <Text
                    style={[
                      styles.historyStatus,
                      { color: p.status === 'completed' ? '#10b981' : '#f59e0b' },
                    ]}
                  >
                    {p.status === 'completed' ? 'Tamamlandı' : 'Ödeme Bekleniyor'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
  },
  summaryCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 18,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  summaryBalance: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
  },
  summaryUnit: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f97316',
  },
  summaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 229, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
  },
  summaryBadgeText: {
    color: '#00e5ff',
    fontSize: 11,
    fontWeight: '700',
  },
  summaryStatsRow: {
    flexDirection: 'row',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  summaryStatItem: {
    flex: 1,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: 12,
  },
  summaryStatLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  summaryStatValue: {
    fontSize: 13,
    color: '#f8fafc',
    fontWeight: '800',
    marginTop: 3,
  },
  emailNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  emailNoticeText: {
    flex: 1,
    fontSize: 11,
    color: '#fde68a',
    lineHeight: 16,
  },
  loginPromptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
  },
  loginPromptText: {
    flex: 1,
    fontSize: 12,
    color: '#00e5ff',
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 14,
  },
  pkgCard: {
    backgroundColor: '#0f172a',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 14,
  },
  pkgCardPopular: {
    borderColor: '#f59e0b',
    backgroundColor: '#111c33',
  },
  popularRibbon: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f59e0b',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 10,
  },
  popularRibbonText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#030712',
  },
  pkgTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  pkgTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#ffffff',
  },
  pkgCreditPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  pkgCreditPillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#10b981',
  },
  pkgPrice: {
    fontSize: 21,
    fontWeight: '900',
    color: '#ffffff',
  },
  pkgUnitPrice: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    marginTop: 2,
  },
  pkgDesc: {
    fontSize: 12,
    color: '#cbd5e1',
    marginTop: 10,
    lineHeight: 18,
  },
  buyBtn: {
    marginTop: 14,
    backgroundColor: '#00e5ff',
    borderRadius: 12,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyBtnText: {
    color: '#030712',
    fontSize: 14,
    fontWeight: '900',
  },
  demoCard: {
    backgroundColor: '#0c1527',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.35)',
    marginTop: 6,
    marginBottom: 16,
  },
  demoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  demoIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
  demoSub: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
    lineHeight: 17,
  },
  demoStatusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    padding: 10,
    borderRadius: 10,
  },
  demoStatusText: {
    flex: 1,
    fontSize: 12,
    color: '#e2e8f0',
    fontWeight: '600',
    lineHeight: 17,
  },
  demoBtn: {
    marginTop: 14,
    backgroundColor: '#0284c7',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginTop: 8,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
  historyDate: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  historyAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#e2e8f0',
  },
  historyStatus: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
});
