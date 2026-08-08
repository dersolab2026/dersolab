import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // iyzipay, kaynak dosyalarını fs.readdirSync + dinamik require ile yukluyor;
  // bu, Turbopack'in statik analizle bundle edemedigi bir desen. Paketi
  // bundle'lamak yerine sunucuda dogrudan require etmesini sagliyoruz.
  serverExternalPackages: ['iyzipay'],
};

export default nextConfig;
