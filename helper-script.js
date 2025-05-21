// Helper Başvuru Sayfası JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Yükleme ekranını işle
    handleLoadingScreen();
    
    // Mobil menü düğmesi
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Helper başvuru formu
    const helperApplicationForm = document.getElementById('helperApplicationForm');
    const successMessage = document.getElementById('successMessage');
    const newApplicationBtn = document.getElementById('newApplicationBtn');
    
    // Önceki yetkili deneyimi açıklama alanını göster/gizle
    const previousExperienceRadios = document.querySelectorAll('input[name="previousExperience"]');
    const previousExperienceDetails = document.getElementById('previousExperienceDetails');
    
    if (previousExperienceRadios.length > 0) {
        previousExperienceRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'yes') {
                    previousExperienceDetails.style.display = 'block';
                } else {
                    previousExperienceDetails.style.display = 'none';
                }
            });
        });
    }
    
    // Ban açıklama alanını göster/gizle
    const previousBansRadios = document.querySelectorAll('input[name="previousBans"]');
    const banDetails = document.getElementById('banDetails');
    
    if (previousBansRadios.length > 0) {
        previousBansRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'yes') {
                    banDetails.style.display = 'block';
                } else {
                    banDetails.style.display = 'none';
                }
            });
        });
    }
    
    // Form gönderimi
    if (helperApplicationForm) {
        helperApplicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                // Form verilerini al
                const formData = new FormData(helperApplicationForm);
                const applicationData = {};
                
                for (const [key, value] of formData.entries()) {
                    applicationData[key] = value;
                }
                
                // Discord webhook'a gönder
                sendHelperApplicationToDiscord(applicationData);
                
                // Başarı mesajını göster
                helperApplicationForm.classList.add('hidden');
                successMessage.classList.remove('hidden');
                
                // Sayfayı yukarı kaydır
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Yeni başvuru butonu
    if (newApplicationBtn) {
        newApplicationBtn.addEventListener('click', function() {
            successMessage.classList.add('hidden');
            helperApplicationForm.classList.remove('hidden');
            helperApplicationForm.reset();
            
            // Koşullu alanları gizle
            if (previousExperienceDetails) previousExperienceDetails.style.display = 'none';
            if (banDetails) banDetails.style.display = 'none';
        });
    }
    
    // Form doğrulama
    function validateForm() {
        let isValid = true;
        const requiredFields = helperApplicationForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        // Özel doğrulama kuralları
        const age = document.getElementById('age');
        if (age && (parseInt(age.value) < 16 || parseInt(age.value) > 99)) {
            isValid = false;
            age.classList.add('error');
        }
        
        const availableHours = document.getElementById('availableHours');
        if (availableHours && (parseInt(availableHours.value) < 1 || parseInt(availableHours.value) > 168)) {
            isValid = false;
            availableHours.classList.add('error');
        }
        
        // Hata mesajı
        if (!isValid) {
            alert('Lütfen tüm gerekli alanları doldurun ve geçerli değerler girin.');
        }
        
        return isValid;
    }
    
    // Helper başvurusunu Discord'a gönderme
    function sendHelperApplicationToDiscord(applicationData) {
        // Discord webhook yapılandırması
        const Webhooks = {
            helper: {
                username: "Santos Vibe Helper Başvuru",
                link: "https://discord.com/api/webhooks/1276271700232765531/QwvY9NzCAG_x9KqXLSOgY9rPMEz6vxMl6sfVTYQyxfs6G5csyYH4sEf2tijb1mdOs-Ce",
                avatar: "https://i.imgur.com/8wBQZYY.jpg"
            }
        };
        
        // Webhook verisini oluştur
        const webhookData = {
            username: Webhooks.helper.username,
            avatar_url: Webhooks.helper.avatar,
            embeds: [
                {
                    title: "Yeni Helper Başvurusu",
                    color: 7506394, // Discord mor rengi
                    description: `**${applicationData.characterName}** adlı karakter sahibi tarafından yeni bir Helper başvurusu yapıldı.`,
                    thumbnail: {
                        url: "https://i.imgur.com/8wBQZYY.jpg"
                    },
                    fields: [
                        {
                            name: "📝 Karakter Adı",
                            value: applicationData.characterName || "Belirtilmemiş",
                            inline: true
                        },
                        {
                            name: "👤 Gerçek Adı",
                            value: applicationData.realName || "Belirtilmemiş",
                            inline: true
                        },
                        {
                            name: "🎂 Yaş",
                            value: applicationData.age || "Belirtilmemiş",
                            inline: true
                        },
                        {
                            name: "🔊 Discord",
                            value: applicationData.discord || "Belirtilmemiş",
                            inline: true
                        },
                        {
                            name: "🌐 Zaman Dilimi",
                            value: applicationData.timezone || "Belirtilmemiş",
                            inline: true
                        },
                        {
                            name: "⏰ Haftalık Aktif Saat",
                            value: applicationData.availableHours + " saat" || "Belirtilmemiş",
                            inline: true
                        },
                        {
                            name: "⌛ Sunucuda Oynama Süresi",
                            value: getServerTimeText(applicationData.serverTime) || "Belirtilmemiş",
                            inline: true
                        },
                        {
                            name: "🎭 Roleplay Deneyimi",
                            value: getRpExperienceText(applicationData.rpExperience) || "Belirtilmemiş",
                            inline: true
                        },
                        {
                            name: "🎮 Oyun Bilgisi",
                            value: getGameKnowledgeText(applicationData.gameKnowledge) || "Belirtilmemiş",
                            inline: true
                        },
                        {
                            name: "👮 Önceki Yetkili Deneyimi",
                            value: applicationData.previousExperience === "yes" ? "Evet" : "Hayır",
                            inline: true
                        },
                        {
                            name: "🚫 Önceki Yasaklanma",
                            value: applicationData.previousBans === "yes" ? "Evet" : "Hayır",
                            inline: true
                        },
                        {
                            name: "📋 Önceki Yetkili Deneyimi Detayları",
                            value: applicationData.previousExperience === "yes" ? 
                                  (applicationData.previousServerDetails || "Detay belirtilmemiş") : 
                                  "Önceki deneyim yok"
                        },
                        {
                            name: "⛔ Yasaklanma Detayları",
                            value: applicationData.previousBans === "yes" ? 
                                  (applicationData.banExplanation || "Detay belirtilmemiş") : 
                                  "Yasaklanma yok"
                        },
                        {
                            name: "💭 Neden Helper Olmak İstiyor",
                            value: applicationData.whyHelper || "Belirtilmemiş"
                        },
                        {
                            name: "✨ Kişisel Özellikler",
                            value: applicationData.qualities || "Belirtilmemiş"
                        },
                        {
                            name: "🔧 Sunucu İyileştirme Önerileri",
                            value: applicationData.improvements || "Belirtilmemiş"
                        },
                        {
                            name: "🎬 Senaryo Yanıtı",
                            value: applicationData.scenario || "Belirtilmemiş"
                        },
                        {
                            name: "📌 Ek Bilgiler",
                            value: applicationData.additionalInfo || "Belirtilmemiş"
                        }
                    ],
                    timestamp: new Date().toISOString(),
                    footer: {
                        text: "Santos Vibe Roleplay - Helper Başvuru Sistemi"
                    }
                }
            ]
        };
        
        // Webhook'a gönder
        sendToWebhook(Webhooks.helper.link, webhookData);
        
        // Yerel depolamaya kaydet
        try {
            const applicationKey = 'helper_application_' + new Date().getTime();
            const applicationDataStr = JSON.stringify({
                timestamp: new Date().toISOString(),
                data: applicationData
            });
            localStorage.setItem(applicationKey, applicationDataStr);
            console.log('Helper başvurusu yerel olarak kaydedildi:', applicationKey);
        } catch (e) {
            console.error('Yerel kaydetme hatası:', e);
        }
    }
    
    // Webhook'a gönderme yardımcı fonksiyonu
    function sendToWebhook(webhookUrl, data) {
        // CORS proxy kullanarak webhook'a erişim
        const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const proxyWebhookUrl = corsProxyUrl + webhookUrl;
        
        console.log('Webhook gönderiliyor:', data);
        
        // Önce CORS proxy kullanarak deneyelim
        try {
            fetch(proxyWebhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest' // CORS proxy için gerekli
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                console.log('Webhook yanıtı:', response.status);
                if (!response.ok) {
                    // CORS proxy başarısız olursa doğrudan deneme yap
                    directWebhookCall(webhookUrl, data);
                }
            })
            .catch(error => {
                console.error('CORS proxy hatası:', error);
                // CORS proxy başarısız olursa doğrudan deneme yap
                directWebhookCall(webhookUrl, data);
            });
        } catch (error) {
            console.error('Fetch hatası:', error);
            // Hata durumunda doğrudan deneme yap
            directWebhookCall(webhookUrl, data);
        }
    }
    
    // Doğrudan webhook çağrısı (CORS proxy başarısız olursa)
    function directWebhookCall(webhookUrl, data) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', webhookUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onload = function() {
            console.log('Doğrudan webhook yanıtı:', xhr.status);
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log('Başvuru başarıyla gönderildi');
            } else {
                console.error('Discord webhook hatası:', xhr.statusText);
            }
        };
        
        xhr.onerror = function() {
            console.error('Bağlantı hatası');
        };
        
        xhr.send(JSON.stringify(data));
    }
});

// Yükleme ekranını işleme fonksiyonu
function handleLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    if (loadingScreen) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                loadingScreen.style.opacity = '0';
                setTimeout(function() {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 1500);
        });
    }
}

// Yardımcı fonksiyonlar
function getServerTimeText(serverTime) {
    const serverTimeMap = {
        '0-1': '0-1 Ay',
        '1-3': '1-3 Ay',
        '3-6': '3-6 Ay',
        '6-12': '6-12 Ay',
        '12+': '1 Yıldan Fazla'
    };
    
    return serverTimeMap[serverTime] || serverTime || 'Belirtilmemiş';
}

function getRpExperienceText(rpExperience) {
    const rpExperienceMap = {
        'beginner': 'Başlangıç (0-6 Ay)',
        'intermediate': 'Orta (6 Ay - 2 Yıl)',
        'experienced': 'Deneyimli (2-5 Yıl)',
        'veteran': 'Uzman (5+ Yıl)'
    };
    
    return rpExperienceMap[rpExperience] || rpExperience || 'Belirtilmemiş';
}

function getGameKnowledgeText(gameKnowledge) {
    const gameKnowledgeMap = {
        'basic': 'Temel',
        'intermediate': 'Orta',
        'advanced': 'İleri',
        'expert': 'Uzman'
    };
    
    return gameKnowledgeMap[gameKnowledge] || gameKnowledge || 'Belirtilmemiş';
}
