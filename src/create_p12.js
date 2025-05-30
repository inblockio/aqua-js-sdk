// make-p12.js  —  generates key → self-signed X.509 → PKCS#12
import fs from 'node:fs';
import forge from 'node-forge';

// 1. key-pair (RSA-2048; forge can also do EC)
const keys = forge.pki.rsa.generateKeyPair(2048);

// 2. build a self-signed certificate
const cert = forge.pki.createCertificate();
cert.publicKey        = keys.publicKey;
cert.serialNumber     = '01';
cert.validity.notBefore = new Date();
cert.validity.notAfter  = new Date();
cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

const dn = [
  { name: 'commonName',      value: 'example.org' },
  { name: 'countryName',     value: 'ES'          },
  { shortName: 'ST',         value: 'Madrid'      },
  { name: 'organizationName',value: 'Demo Co'     },
];
cert.setSubject(dn);
cert.setIssuer(dn);               // self-signed
cert.setExtensions([
  { name: 'basicConstraints', cA: false },
  { name: 'keyUsage',         digitalSignature: true, keyEncipherment: true },
  { name: 'extKeyUsage',      clientAuth: true, serverAuth: true },
  { name: 'subjectAltName',   altNames: [{ type: 2, value: 'example.org' }] },
]);

cert.sign(keys.privateKey, forge.md.sha256.create());

// 3. wrap key + cert in PKCS#12
const password = 'StrongPass!';
const p12Asn1  = forge.pkcs12.toPkcs12Asn1(
  keys.privateKey,
  [cert],                               // certificate chain (array)
  password,
  { friendlyName: 'myCert', generateLocalKeyId: true }
);                                      // :contentReference[oaicite:0]{index=0}

const p12Der  = forge.asn1.toDer(p12Asn1).getBytes();
fs.writeFileSync('myCert.p12', Buffer.from(p12Der, 'binary'));

console.log('✔ PKCS#12 written to myCert.p12');

const p12Buf   = fs.readFileSync('./myCert.p12');
// const p12String  = p12Buf.toString('binary');
fs.writeFileSync('./myCert.txt', p12Buf.toString());