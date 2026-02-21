import { create } from 'zustand';

export interface LabSettings {
    // ── Di chuyển ──
    movementSpeed: number;       // Tốc độ di chuyển (mặc định: 5)
    sprintMultiplier: number;    // Hệ số chạy nhanh (mặc định: 1.8)
    jumpForce: number;           // Lực nhảy (mặc định: 5)

    // ── Camera / Chuột ──
    mouseSensitivity: number;    // Độ nhạy chuột tổng (mặc định: 1)
    fov: number;                 // Tầm nhìn - Field of View (mặc định: 50)
    invertY: boolean;            // Đảo trục Y (mặc định: false)

    // ── Môi trường ──
    ambientIntensity: number;
    envPreset: string;
    envBlur: number;
    lightIntensity: number;

    // ── Bóng đổ ──
    shadowOpacity: number;
    shadowBlur: number;

    // ── Hậu kỳ ──
    enableEffects: boolean;
    bloomIntensity: number;
    bloomThreshold: number;

    // ── Hiệu năng ──
    pixelRatio: number;
    antialias: boolean;
}

interface LabSettingsStore extends LabSettings {
    updateSetting: <K extends keyof LabSettings>(key: K, value: LabSettings[K]) => void;
    applyPreset: (preset: string) => void;
    resetToDefaults: () => void;
}

const DEFAULT_SETTINGS: LabSettings = {
    // Di chuyển
    movementSpeed: 5,
    sprintMultiplier: 1.8,
    jumpForce: 5,

    // Camera
    mouseSensitivity: 1,
    fov: 50,
    invertY: false,

    // Môi trường
    ambientIntensity: 0.12,
    envPreset: 'apartment',
    envBlur: 1,
    lightIntensity: 2,

    // Bóng đổ
    shadowOpacity: 0,
    shadowBlur: 0,

    // Hậu kỳ
    enableEffects: true,
    bloomIntensity: 0.05,
    bloomThreshold: 1,

    // Hiệu năng
    pixelRatio: 1.5,
    antialias: true,
};

const PRESETS: Record<string, Partial<LabSettings>> = {
    standard: { ...DEFAULT_SETTINGS },
    bright: {
        ambientIntensity: 0.5,
        envPreset: 'studio',
        envBlur: 1,
        lightIntensity: 5,
        shadowOpacity: 0.1,
        shadowBlur: 2,
        enableEffects: true,
        bloomIntensity: 0.15,
        bloomThreshold: 0.8,
    },
    cinematic: {
        ambientIntensity: 0.08,
        envPreset: 'city',
        envBlur: 0.8,
        lightIntensity: 2,
        shadowOpacity: 0.6,
        shadowBlur: 5,
        enableEffects: true,
        bloomIntensity: 0.2,
        bloomThreshold: 0.7,
    },
    realistic: {
        ambientIntensity: 0.2,
        envPreset: 'apartment',
        envBlur: 0.5,
        lightIntensity: 3,
        shadowOpacity: 0.4,
        shadowBlur: 3,
        enableEffects: true,
        bloomIntensity: 0.08,
        bloomThreshold: 0.9,
    },
};

export const useLabSettings = create<LabSettingsStore>((set) => ({
    ...DEFAULT_SETTINGS,

    updateSetting: (key, value) => set({ [key]: value }),

    applyPreset: (preset: string) => {
        const presetValues = PRESETS[preset];
        if (presetValues) {
            set(presetValues);
        }
    },

    resetToDefaults: () => set(DEFAULT_SETTINGS),
}));
