const admin = require('firebase-admin');

const serviceAccount = {

    "project_id": "rootmath-development",
    "private_key_id": "b57a8935ea88de110ab731179a580cedd7ae1fc6",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCm3+3sDKj88E0b\nhd1YIW2P26A16RTuxv3OI3vtauqF/hxgdoJXSGtkyoP9pLbW5HJVYkgrNCytc3Yq\nOrcmpmanbazwWeCMfbpHYq6by0Jy62mQr5uQBKv/uHnXdmDDFlto4aBGKQhMwsXr\nf7vfG6GkQtOHLnurAqH8CkWmpTndNPcloaDch+ngJP+6m7FYHkr5cDPgjcJNulzL\n0UkivHxCQubTOOcrljEcAr5S6fqj+Of2INasmlngHghyE4Kz3UJ94qqQTe7pUgEj\nEKmnEHANTNEY0isRP+F+uPlP1fC4JsR4hKHDDFPGG6msb3JYGeMItl+NR8BIBnMN\nUgrWnantAgMBAAECggEAErshdWTBZizh9tQqkX0lE2f7XnnEdf3jmMseWrqsyvAI\nRuKehEYWeeiKcsLVnB7l34Qp5iGT3z9N1PUkwEOe063Jouvvus1VBrTCtS2WTphy\nj8FKZJrFpK1UDdWVjGhax9XFnAJ4kkctmJ7Mm4E6Ploa7LpQutQPkx8jDM7QhS4B\nZZl491+KQ22LxogfijwPg5mf67O7QhU/43ZYDpkPEysRhnoURr9Tzu40i5QFEhrS\nAHlx3iMUe5lAYofVil0OgVj+wuTvEPU+T/ck9NV4aXILn4aNLuE94RwKLj8ruAWR\niLUD/lBWPOLtDzD51rDo52+GCkYEGoKA9lEOamkQsQKBgQDlbJq3wm9WBUma0w9q\nTchsxPK0JMlIgdJopm1+Wb3310eE5JkDcEX92j3RG75NXayP0JSmprxVUutrjQNc\nrcK4XJMYRW0pobRxMga2ENfsJg/VSMWqC1R9Mi9fJAvtw12WqDz/CTlN63nLFc7L\nU/JxhMJ4gw57cDaTPngE+igPXQKBgQC6NHflcc9ey1EMCgM0hdjW0CW24XE3o4mT\nf4X3I+N/WvFV/nj04rZdBpc+SlofFbQN6EQc5bRx0YLl2AgL2Nwe+7NJvNVo4UHE\nV/ZezrIQdMFaYVEYzqRLXGsArJcgPiBTZaZdKEBu70EnDBy9nP0P3v4yDyMmHQjr\n820ZM96r0QKBgFkFuUtQoQ8J4jO3biXbpMe/7EVGeOwvo8uDuLzsabA/0rqYUV9q\nM157Tr1TPJacoJb1Ypj/3dhl4n/LKeDOc95B3bnvRpp+6pt5w+zlwEMbyc0C/eAr\noU8rKAKM5CwQQMJy6ag0lg3ML2hEQAfZvRubXjKQ+A+hzSt5c+zKfLzpAoGAbzJg\nGzwg62odZ0Qfb+Eyge3hZ9ovg1t9EAFKnjDnbamAj6sczpkI8Hq8HS3HreKHGPsI\nmf0vCf1k3x9ohrKlmTcUdUd4Zl6GqNsivLFQsvUWdoPBK0BT6tEw8UEgKtgO896z\nP9SGzfjA/rGEBFPY5/5x7LEPe3ZBWq6PC0rngdECgYALd6u+J/iHzpS41t+D/IpY\nTpNNmG4hNfiSwm72rYErc7RHMZ5vG66udCg43iSE6QfQ+O39MtpiD/rFoLMC6U71\nr5NxuNLZahVtuC27dbi7ZpACebQgwKW6Uf/YnDyFeFfzoK6Zc8h9MK5FxxC35O1g\n41saD2C89zeekV3v+u3dzA==\n-----END PRIVATE KEY-----\n".replace(/\\n/g, "\n"),
    "client_email": "firebase-adminsdk-dxy4y@rootmath-development.iam.gserviceaccount.com",
    "client_id": "102867375294352634452",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-dxy4y%40rootmath-development.iam.gserviceaccount.com"
  }

const firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})


module.exports.firebaseAdmin = firebase.auth()
