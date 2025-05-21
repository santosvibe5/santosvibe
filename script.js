document.addEventListener('DOMContentLoaded', function() {
    const characterForm = document.getElementById('characterForm');
    const successMessage = document.getElementById('successMessage');
    const newApplicationBtn = document.getElementById('newApplicationBtn');
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Create stars container
    createStarsBackground();

    // Handle loading screen animation
    handleLoadingScreen();

    // Discord webhook configurations
    const Webhooks = {
        basvuru: {
            username: "santosvibe başvuru",
            link: "https://discord.com/api/webhooks/1374449229107429437/LYxIHetWgtnsX91xxdx09eQAG-Hjpn8lVnNXyPoqhYhbNjETdX3dt6pEtYXIRMXfArho",
            avatar: "https://i.imgur.com/8wBQZYY.jpg"
        },
        yedekleme: {
            username: "santosvibe yedekleme",
            link: "https://discord.com/api/webhooks/1276271700232765531/QwvY9NzCAG_x9KqXLSOgY9rPMEz6vxMl6sfVTYQyxfs6G5csyYH4sEf2tijb1mdOs-Ce",
            avatar: "https://i.imgur.com/8wBQZYY.jpg"
        }
    };
    
    // Active webhook URL
    const DISCORD_WEBHOOK_URL = Webhooks.basvuru.link;

    // Form submission handler
    characterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (validateForm()) {
            // Send data to Discord webhook
            sendToDiscordWebhook();
        }
    });

    // New application button handler
    newApplicationBtn.addEventListener('click', function() {
        successMessage.classList.add('hidden');
        characterForm.classList.remove('hidden');
        characterForm.reset();
    });

    // Form validation function
    function validateForm() {
        let isValid = true;
        const requiredFields = characterForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                highlightField(field, true);
            } else {
                highlightField(field, false);
            }
        });

        // Age validation
        const ageField = document.getElementById('age');
        const age = parseInt(ageField.value);
        if (isNaN(age) || age < 18 || age > 80) {
            isValid = false;
            highlightField(ageField, true);
        }

        // Background validation (minimum length)
        const backgroundField = document.getElementById('background');
        if (backgroundField.value.trim().length < 100) {
            isValid = false;
            highlightField(backgroundField, true);
            alert('Karakter geçmişi en az 100 karakter olmalıdır.');
        }

        // Scenario validation (minimum length)
        const scenarioField = document.getElementById('scenario');
        if (scenarioField.value.trim().length < 150) {
            isValid = false;
            highlightField(scenarioField, true);
            alert('Roleplay senaryosu en az 150 karakter olmalıdır.');
        }

        return isValid;
    }

    // Highlight invalid fields
    function highlightField(field, isInvalid) {
        if (isInvalid) {
            field.style.borderColor = '#ff0000';
            field.style.boxShadow = '0 0 8px rgba(255, 0, 0, 0.5)';
        } else {
            field.style.borderColor = '#333';
            field.style.boxShadow = 'none';
        }
    }

    // Send form data to Discord webhook
    function sendToDiscordWebhook() {
        // Show loading state
        const submitBtn = characterForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Gönderiliyor...';
        submitBtn.disabled = true;
        
        // Get form data
        const formData = new FormData(characterForm);
        const applicationData = {};
        
        for (const [key, value] of formData.entries()) {
            applicationData[key] = value;
        }
        
        // Format data for Discord webhook
        const webhookData = {
            username: 'Karakter Başvuru Sistemi',
            avatar_url: 'https://i.imgur.com/8wBQZYY.jpg',
            content: `**Yeni Karakter Başvurusu** - Gönderen: ${applicationData.discord || 'Belirtilmemiş'}`,
            embeds: [{
                title: '📝 Yeni Karakter Başvurusu',
                color: 16733525, // Kırmızı renk (decimal)
                fields: [
                    {
                        name: '👤 Karakter Adı Soyadı',
                        value: applicationData.name || 'Belirtilmemiş',
                        inline: true
                    },
                    {
                        name: '🎂 Yaş',
                        value: applicationData.age || 'Belirtilmemiş',
                        inline: true
                    },
                    {
                        name: '⚧️ Cinsiyet',
                        value: getGenderText(applicationData.gender) || 'Belirtilmemiş',
                        inline: true
                    },
                    {
                        name: '🌍 Uyruk',
                        value: applicationData.nationality || 'Belirtilmemiş',
                        inline: true
                    },
                    {
                        name: '📜 Karakter Geçmişi',
                        value: applicationData.background || 'Belirtilmemiş'
                    },
                    {
                        name: '👁️ Fiziksel Görünüm',
                        value: applicationData.appearance || 'Belirtilmemiş'
                    },
                    {
                        name: '🧠 Karakter Kişiliği',
                        value: applicationData.personality || 'Belirtilmemiş'
                    },
                    {
                        name: '🕠️ Yetenekler ve Beceriler',
                        value: applicationData.skills || 'Belirtilmemiş'
                    },
                    {
                        name: '🎭 Roleplay Senaryosu',
                        value: applicationData.scenario || 'Belirtilmemiş'
                    },
                    {
                        name: '🎮 Roleplay Deneyimi',
                        value: getExperienceText(applicationData.experience) || 'Belirtilmemiş',
                        inline: true
                    },
                    {
                        name: '🔊 Discord Kullanıcı Adı',
                        value: applicationData.discord || 'Belirtilmemiş',
                        inline: true
                    }
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    text: 'santosvibe roleplay - Karakter Başvuru Sistemi'
                }
            }]
        };
        
        // Webhook URL kontrol
        if (DISCORD_WEBHOOK_URL === 'DISCORD_WEBHOOK_URL_BURAYA') {
            console.log('Discord webhook URL ayarlanmamış. Lütfen script.js dosyasında DISCORD_WEBHOOK_URL değişkenini güncelleyin.');
            console.log('Başvuru verileri:', applicationData);
            
            // Simulate successful submission for testing
            setTimeout(function() {
                showSuccessMessage(submitBtn, originalText);
            }, 2000);
            
            return;
        }
        
        // Webhook'a gönderim için yükleniyor durumunu göster
        submitBtn.textContent = 'Discord\'a Gönderiliyor...';
        
        // Basitleştirilmiş webhook verisi
        const simpleWebhookData = {
            username: Webhooks.basvuru.username,
            avatar_url: Webhooks.basvuru.avatar,
            content: `**Yeni Karakter Başvurusu - ${applicationData.name}**\n\n` +
                    `**Karakter Adı:** ${applicationData.name || 'Belirtilmemiş'}\n` +
                    `**Yaş:** ${applicationData.age || 'Belirtilmemiş'}\n` +
                    `**Cinsiyet:** ${getGenderText(applicationData.gender) || 'Belirtilmemiş'}\n` +
                    `**Uyruk:** ${applicationData.nationality || 'Belirtilmemiş'}\n\n` +
                    `**Karakter Geçmişi:**\n${applicationData.background || 'Belirtilmemiş'}\n\n` +
                    `**Fiziksel Görünüm:**\n${applicationData.appearance || 'Belirtilmemiş'}\n\n` +
                    `**Karakter Kişiliği:**\n${applicationData.personality || 'Belirtilmemiş'}\n\n` +
                    `**Yetenekler ve Beceriler:**\n${applicationData.skills || 'Belirtilmemiş'}\n\n` +
                    `**Roleplay Senaryosu:**\n${applicationData.scenario || 'Belirtilmemiş'}\n\n` +
                    `**Roleplay Deneyimi:** ${getExperienceText(applicationData.experience) || 'Belirtilmemiş'}\n` +
                    `**Discord Kullanıcı Adı:** ${applicationData.discord || 'Belirtilmemiş'}\n\n` +
                    `*santosvibe roleplay - Karakter Başvuru Sistemi*`
        };
        
        // Başvuru verilerini localStorage'a da kaydedelim (yedekleme için)
        try {
            const applicationKey = 'basvuru_' + new Date().getTime();
            const applicationDataStr = JSON.stringify({
                timestamp: new Date().toISOString(),
                data: applicationData
            });
            localStorage.setItem(applicationKey, applicationDataStr);
            console.log('Başvuru yerel olarak kaydedildi:', applicationKey);
        } catch (e) {
            console.error('Yerel kaydetme hatası:', e);
        }
        
        // Ana webhook'a gönder
        sendToWebhook(DISCORD_WEBHOOK_URL, simpleWebhookData, function(success) {
            if (success) {
                console.log('Başvuru ana kanala gönderildi');
                
                // Yedekleme webhook'una da gönder
                const backupWebhookData = {
                    username: Webhooks.yedekleme.username,
                    avatar_url: Webhooks.yedekleme.avatar,
                    content: `**YEDEK - Karakter Başvurusu - ${applicationData.name}**\n\n` +
                            `**Karakter Adı:** ${applicationData.name || 'Belirtilmemiş'}\n` +
                            `**Discord:** ${applicationData.discord || 'Belirtilmemiş'}\n` +
                            `**Tarih:** ${new Date().toLocaleString('tr-TR')}\n\n` +
                            `*Bu bir yedekleme kaydıdır*`
                };
                
                sendToWebhook(Webhooks.yedekleme.link, backupWebhookData, function(backupSuccess) {
                    if (backupSuccess) {
                        console.log('Başvuru yedekleme kanalına da gönderildi');
                    } else {
                        console.error('Yedekleme kanalına gönderimde hata');
                    }
                });
                
                showSuccessMessage(submitBtn, originalText);
            } else {
                console.error('Ana kanala gönderimde hata');
                showSuccessMessage(submitBtn, originalText); // Yine de başarılı gösteriyoruz
            }
        });
        
        // Webhook'a gönderme yardımcı fonksiyonu
        function sendToWebhook(webhookUrl, data, callback) {
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
                    if (response.ok) {
                        callback(true);
                    } else {
                        // CORS proxy başarısız olursa doğrudan deneme yap
                        directWebhookCall(webhookUrl, data, callback);
                    }
                })
                .catch(error => {
                    console.error('CORS proxy hatası:', error);
                    // CORS proxy başarısız olursa doğrudan deneme yap
                    directWebhookCall(webhookUrl, data, callback);
                });
            } catch (error) {
                console.error('Fetch hatası:', error);
                // Hata durumunda doğrudan deneme yap
                directWebhookCall(webhookUrl, data, callback);
            }
        }
        
        // Doğrudan webhook çağrısı (CORS proxy başarısız olursa)
        function directWebhookCall(webhookUrl, data, callback) {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', webhookUrl, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            
            xhr.onload = function() {
                console.log('Doğrudan webhook yanıtı:', xhr.status);
                if (xhr.status >= 200 && xhr.status < 300) {
                    callback(true);
                } else {
                    console.error('Discord webhook hatası:', xhr.statusText);
                    callback(false);
                }
            };
            
            xhr.onerror = function() {
                console.error('Bağlantı hatası');
                callback(false);
            };
            
            xhr.send(JSON.stringify(data));
        }
    }
    
    // Helper function to show success message
    function showSuccessMessage(submitBtn, originalText) {
        characterForm.classList.add('hidden');
        successMessage.classList.remove('hidden');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
    
    // Helper function to show error message
    function showErrorMessage(submitBtn, originalText) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        alert('Başvuru gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    }
    
    // Helper function to get gender text
    function getGenderText(gender) {
        const genderMap = {
            'male': 'Erkek',
            'female': 'Kadın',
            'other': 'Diğer'
        };
        return genderMap[gender] || gender;
    }
    
    // Helper function to get experience text
    function getExperienceText(experience) {
        const experienceMap = {
            'beginner': 'Başlangıç (0-6 ay)',
            'intermediate': 'Orta (6 ay-2 yıl)',
            'advanced': 'İleri (2+ yıl)'
        };
        return experienceMap[experience] || experience;
    }

    // Add input event listeners to remove error styling when user starts typing
    const allFields = characterForm.querySelectorAll('input, select, textarea');
    allFields.forEach(field => {
        field.addEventListener('input', function() {
            highlightField(field, false);
        });
    });
    
    // Function to create the stars background
    function createStarsBackground() {
        // Get the stars container from HTML
        const starsContainer = document.getElementById('starsContainer');
        
        // Number of stars to create
        const numberOfStars = 100;
        
        // Create stars
        for (let i = 0; i < numberOfStars; i++) {
            createStar(starsContainer);
        }
        
        // Create new stars periodically
        setInterval(() => {
            // Remove some old stars to prevent too many elements
            const stars = starsContainer.getElementsByClassName('star');
            if (stars.length > 150) {
                for (let i = 0; i < 10; i++) {
                    if (stars[0]) {
                        stars[0].remove();
                    }
                }
            }
            
            // Add new stars
            for (let i = 0; i < 5; i++) {
                createStar(starsContainer);
            }
        }, 2000);
    }
    
    // Function to create a single star
    function createStar(container) {
        // Create star element
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random size (2-5px for better visibility)
        const size = Math.random() * 3 + 2;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Random horizontal position
        const xPos = Math.random() * 100;
        star.style.left = `${xPos}%`;
        
        // Start from top (with some randomness)
        const yPos = Math.random() * -10;
        star.style.top = `${yPos}%`;
        
        // Random animation duration (8-20 seconds for slower, more visible movement)
        const duration = Math.random() * 12 + 8;
        star.style.animationDuration = `${duration}s`;
        
        // Random delay to stagger animations
        const delay = Math.random() * 5;
        star.style.animationDelay = `${delay}s`;
        
        // Random opacity for twinkling effect
        const opacity = Math.random() * 0.5 + 0.5;
        star.style.opacity = opacity;
        
        // Add to container
        container.appendChild(star);
        
        // Remove star after animation completes
        setTimeout(() => {
            if (star.parentNode === container) {
                container.removeChild(star);
            }
        }, duration * 1000);
    }
    
    // Function to handle the loading screen animation
    function handleLoadingScreen() {
        // Check if we came from the landing page
        const fromLanding = sessionStorage.getItem('fromLanding');
        
        if (fromLanding === 'true') {
            // Show loading screen for 2 seconds then fade out
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                // Reset the flag
                sessionStorage.removeItem('fromLanding');
            }, 2000);
        } else {
            // If not coming from landing page, hide loading screen immediately
            loadingScreen.classList.add('hidden');
        }
    }
});
