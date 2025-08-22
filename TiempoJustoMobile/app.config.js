export default {
  expo: {
    name: "TiempoJusto",
    slug: "tiempo-justo-mobile",
    version: "0.1.0",
    orientation: "portrait",
    platforms: ["android"],
    jsEngine: "hermes",
    assetBundlePatterns: ["**/*"],
    icon: "./assets/icons/icon-1024.png",
    android: {
      package: "com.tiempojusto.app",
      versionCode: 1,
      permissions: [
        "WAKE_LOCK",
        "RECEIVE_BOOT_COMPLETED",
        "VIBRATE"
      ],
      adaptiveIcon: {
        foregroundImage: "./assets/icons/icon-1024.png",
        backgroundColor: "#FFFFFF"
      }
    },
    extra: {
      eas: {
        projectId: "8da8dceb-16a5-40da-83cb-3af3b97e0c12"
      }
    },
    plugins: [
      // "react-native-google-mobile-ads"
    ]
  }
};
