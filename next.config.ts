import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // iyzipay, kaynak dosyalarını fs.readdirSync + dinamik require ile yukluyor;
  // bu, Turbopack'in statik analizle bundle edemedigi bir desen. Paketi
  // bundle'lamak yerine sunucuda dogrudan require etmesini sagliyoruz.
  serverExternalPackages: ['iyzipay'],
  // serverExternalPackages sayesinde bundle disi kaldi ama Vercel'in dosya
  // izleme (tracing) sistemi dinamik require'i takip edemedigi icin
  // lib/resources klasorunu deploy'a dahil etmiyordu (ENOENT hatasi).
  // Bu klasoru elle dahil ediyoruz.
  outputFileTracingIncludes: {
    '/dashboard/student/packages': ['./node_modules/iyzipay/lib/**/*'],
    '/api/iyzico/callback': ['./node_modules/iyzipay/lib/**/*'],
  },
};

export default nextConfig;
