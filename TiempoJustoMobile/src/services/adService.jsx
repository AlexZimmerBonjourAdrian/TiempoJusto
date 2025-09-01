import mobileAds, {
    InterstitialAd,
    RewardedAd,
    RewardedInterstitialAd,
    AdEventType,
    RewardedAdEventType,
    TestIds,
} from 'react-native-google-mobile-ads';

// Servicio sencillo para rotar anuncios de prueba y dispararlos por eventos de app
class AdService {
    constructor() {
        this.isInitialized = false;
        this.rotationIndex = 0;
        this.rotation = ['INTERSTITIAL', 'REWARDED', 'REWARDED_INTERSTITIAL'];

        this.interstitial = null;
        this.rewarded = null;
        this.rewardedInterstitial = null;
    }

    initialize() {
        if (this.isInitialized) return;
        mobileAds().initialize();

        // Crear instancias con IDs de prueba
        this.interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL);
        this.rewarded = RewardedAd.createForAdRequest(TestIds.REWARDED);
        this.rewardedInterstitial = RewardedInterstitialAd.createForAdRequest('ca-app-pub-3940256099942544/5354046379');

        // Suscripciones básicas para recarga automática
        this.interstitial.addAdEventListener(AdEventType.CLOSED, () => {
            try { this.interstitial.load(); } catch { /* noop */ }
        });

        this.rewarded.addAdEventListener(AdEventType.CLOSED, () => {
            try { this.rewarded.load(); } catch { /* noop */ }
        });

        this.rewardedInterstitial.addAdEventListener(AdEventType.CLOSED, () => {
            try { this.rewardedInterstitial.load(); } catch { /* noop */ }
        });

        // Cargar todos al inicio
        try { this.interstitial.load(); } catch {}
        try { this.rewarded.load(); } catch {}
        try { this.rewardedInterstitial.load(); } catch {}

        this.isInitialized = true;
    }

    showNext() {
        if (!this.isInitialized) this.initialize();
        const type = this.rotation[this.rotationIndex % this.rotation.length];
        this.rotationIndex += 1;
        switch (type) {
            case 'INTERSTITIAL':
                this.#showAdInstance(this.interstitial, 'INTERSTITIAL');
                break;
            case 'REWARDED':
                this.#showAdInstance(this.rewarded, 'REWARDED');
                break;
            case 'REWARDED_INTERSTITIAL':
                this.#showAdInstance(this.rewardedInterstitial, 'REWARDED_INTERSTITIAL');
                break;
            default:
                break;
        }
    }

    onProjectCompleted() {
        // Mostrar un interstitial al completar proyecto
        if (!this.isInitialized) this.initialize();
        this.#showAdInstance(this.interstitial, 'INTERSTITIAL');
    }

    // Utilidad: mostrar si está cargado, si no, mostrar al cargar y luego recargar
    #showAdInstance(instance) {
        if (!instance) return;
        try {
            // Propiedad correcta en react-native-google-mobile-ads v10+: get isLoaded() o método getAdLoadState
            if (typeof instance.isLoaded === 'function' ? instance.isLoaded() : instance._loaded === true) {
                instance.show().catch(() => instance.load());
            } else {
                const onLoaded = instance.addAdEventListener(AdEventType.LOADED, () => {
                    try { instance.show().finally(() => onLoaded()); } catch {}
                });
                instance.load();
            }
        } catch {
            try { instance.load(); } catch {}
        }
    }
}

const adService = new AdService();
export default adService;


