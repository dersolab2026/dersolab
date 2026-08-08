import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // iyzipay, kaynak dosyalarını fs.readdirSync + dinamik require ile yukluyor;
  // bu, Turbopack'in statik analizle bundle edemedigi bir desen. Paketi
  // bundle'lamak yerine sunucuda dogrudan require etmesini sagliyoruz.
  serverExternalPackages: ['iyzipay'],
  // serverExternalPackages sayesinde bundle disi kaldi ama Vercel'in dosya
  // izleme (tracing) sistemi dinamik require'leri takip edemedigi icin
  // lib/resources klasorunu ve iyzipay'in gercek bagimliligi olan
  // postman-request'i deploy'a dahil etmiyordu. Ikisini de elle ekliyoruz.
  outputFileTracingIncludes: {
    '/dashboard/student/packages': [
      './node_modules/iyzipay/lib/**/*',
      './node_modules/postman-request/**/*',
    ],
    '/api/iyzico/callback': [
      './node_modules/iyzipay/lib/**/*',
      './node_modules/postman-request/**/*',
    ],
  },
};

export default nextConfig;
