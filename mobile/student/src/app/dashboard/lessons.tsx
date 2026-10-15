import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

type LessonMaterial = {
  id: string;
  title: string;
  file_path: string;
  created_at: string;
};

type BookingDetails = {
  id: string;
  start_time: string;
  end_time: string;
  status: string;
  meet_link: string | null;
  instructor_name: string;
};

export default function LessonDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [materials, setMaterials] = useState<LessonMaterial[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (id) {
      fetchLessonDetails();
    }
  }, [id]);

  const fetchLessonDetails = async () => {
    try {
      // 1. Fetch booking info
      const { data: bookingData, error: bookingErr } = await supabase
        .from('bookings')
        .select(`
          id, start_time, end_time, status, meet_link,
          instructor_id
        `)
        .eq('id', id)
        .single();

      if (bookingErr) throw bookingErr;
      
      let instructorName = 'Eğitmen';
      if (bookingData.instructor_id) {
         const { data: userData } = await supabase
            .from('users')
            .select('name')
            .eq('id', bookingData.instructor_id)
            .single();
         if (userData) {
            instructorName = userData.name;
         }
      }
      
      setBooking({
        ...bookingData,
        instructor_name: instructorName,
      });

      // 2. Fetch materials
      const { data: materialsData, error: materialsErr } = await supabase
        .from('lesson_materials')
        .select('id, title, file_path, created_at')
        .eq('booking_id', id)
        .order('created_at', { ascending: false });

      if (materialsErr) throw materialsErr;
      
      setMaterials(materialsData || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Ders detayları yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const openMaterial = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('lesson-materials')
        .createSignedUrl(filePath, 3600);
        
      if (error) throw error;
      
      if (data?.signedUrl) {
        Linking.openURL(data.signedUrl);
      }
    } catch (e) {
      alert('Dosya açılamadı.');
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('tr-TR', { 
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#00e5ff" />
      </View>
    );
  }

  if (errorMsg || !booking) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Text style={{ color: '#ef4444', marginBottom: 20 }}>{errorMsg || 'Ders bulunamadı'}</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Ders Detayı</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Tarih & Saat</Text>
          <Text style={styles.infoValue}>{formatDate(booking.start_time)}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.infoLabel}>Eğitmen</Text>
          <Text style={styles.infoValue}>{booking.instructor_name}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.infoLabel}>Durum</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{
              booking.status === 'completed' ? 'TAMAMLANDI' :
              booking.status === 'scheduled' ? 'YAKLAŞIYOR' :
              booking.status === 'cancelled' ? 'İPTAL EDİLDİ' : booking.status
            }</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Ders Materyalleri</Text>
        
        {materials.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="document-text-outline" size={48} color="#334155" />
            <Text style={styles.emptyText}>Bu derse ait henüz bir materyal eklenmemiş.</Text>
          </View>
        ) : (
          materials.map((m) => (
            <TouchableOpacity 
              key={m.id} 
              style={styles.materialCard}
              onPress={() => openMaterial(m.file_path)}
            >
              <View style={styles.materialIcon}>
                <Ionicons name="document-text" size={24} color="#ef4444" />
              </View>
              <View style={styles.materialInfo}>
                <Text style={styles.materialTitle}>{m.title}</Text>
                <Text style={styles.materialDate}>Yüklenme: {new Date(m.created_at).toLocaleDateString('tr-TR')}</Text>
              </View>
              <Ionicons name="download-outline" size={20} color="#cbd5e1" />
            </TouchableOpacity>
          ))
        )}
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  iconBtn: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
  },
  topBarTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  infoCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
  },
  infoLabel: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  infoValue: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: 16,
  },
  badge: {
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
  },
  badgeText: {
    color: '#00e5ff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  emptyBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 22,
  },
  materialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  materialIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  materialInfo: {
    flex: 1,
  },
  materialTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  materialDate: {
    color: '#94a3b8',
    fontSize: 12,
  },
  backBtn: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  }
});
