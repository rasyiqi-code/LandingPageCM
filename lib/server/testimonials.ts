const STATIC_TESTIMONIALS = [
    {
        id: "1",
        name: "Andi Wijaya",
        role: "Founder, Retail Online",
        content:
            "Proses kerja tim Crediblemark sangat profesional. Website yang mereka buat benar-benar membantu bisnis saya tumbuh.",
        isActive: true,
        createdAt: new Date("2026-01-10"),
    },
    {
        id: "2",
        name: "Sari Puspita",
        role: "Owner, Klinik & Spa",
        content:
            "Sistem yang dibangun rapi, mudah dikelola, dan desainnya sesuai dengan brand kami. Sangat direkomendasikan!",
        isActive: true,
        createdAt: new Date("2026-02-15"),
    },
    {
        id: "3",
        name: "Budi Hartono",
        role: "Direktur, Startup Teknologi",
        content:
            "Komunikasi jelas, timeline tepat, dan hasil akhir melebihi ekspektasi. Terima kasih Crediblemark.",
        isActive: true,
        createdAt: new Date("2026-03-01"),
    },
];

export const getActiveTestimonials = async (limit = 10) => {
    return STATIC_TESTIMONIALS.filter((t) => t.isActive).slice(0, limit);
};

export const getAllTestimonials = async (limit = 100) => {
    return STATIC_TESTIMONIALS.slice(0, limit);
};