// LSPD Script - Los Santos Polis Departmanı

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
    
    // LSPD başvuru formu
    const lspdApplicationForm = document.getElementById('lspdApplicationForm');
    const successMessage = document.getElementById('successMessage');
    const newApplicationBtn = document.getElementById('newApplicationBtn');
    
    // Sabıka kaydı açıklama alanını göster/gizle
    const criminalRecordRadios = document.querySelectorAll('input[name="criminalRecord"]');
    const criminalRecordDetails = document.getElementById('criminalRecordDetails');
    
    if (criminalRecordRadios.length > 0) {
        criminalRecordRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'yes') {
                    criminalRecordDetails.style.display = 'block';
                } else {
                    criminalRecordDetails.style.display = 'none';
                }
            });
        });
    }
    
    // Başvuru formu gönderimi
    if (lspdApplicationForm) {
        lspdApplicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form verilerini al
            const formData = new FormData(lspdApplicationForm);
            const applicationData = {};
            
            for (const [key, value] of formData.entries()) {
                applicationData[key] = value;
            }
            
            // Discord webhook'a gönder
            sendLSPDApplicationToDiscord(applicationData);
            
            // Başarı mesajını göster
            lspdApplicationForm.classList.add('hidden');
            successMessage.classList.remove('hidden');
        });
    }
    
    // Yeni başvuru butonu
    if (newApplicationBtn) {
        newApplicationBtn.addEventListener('click', function() {
            successMessage.classList.add('hidden');
            lspdApplicationForm.classList.remove('hidden');
            lspdApplicationForm.reset();
        });
    }
    
    // Sayfa içi bağlantılar için yumuşak kaydırma
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
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



// LSPD başvurusunu Discord'a gönderme fonksiyonu
function sendLSPDApplicationToDiscord(applicationData) {
    // Discord webhook yapılandırması
    const Webhooks = {
        lspd: {
            username: "LSPD Başvuru",
            link: "https://discord.com/api/webhooks/1276271700232765531/QwvY9NzCAG_x9KqXLSOgY9rPMEz6vxMl6sfVTYQyxfs6G5csyYH4sEf2tijb1mdOs-Ce",
            avatar: "https://i.imgur.com/8wBQZYY.jpg"
        }
    };
    
    // Webhook verisini oluştur
    const webhookData = {
        username: Webhooks.lspd.username,
        avatar_url: Webhooks.lspd.avatar,
        content: `**Yeni LSPD Başvurusu - ${applicationData.firstName} ${applicationData.lastName}**\n\n` +
                 `**Adı Soyadı:** ${applicationData.firstName} ${applicationData.lastName}\n` +
                 `**Doğum Tarihi:** ${applicationData.birthDate}\n` +
                 `**Cinsiyet:** ${getGenderText(applicationData.gender)}\n` +
                 `**Uyruk:** ${applicationData.nationality}\n` +
                 `**E-posta:** ${applicationData.email}\n` +
                 `**Telefon:** ${applicationData.phone}\n\n` +
                 `**Eğitim Seviyesi:** ${getEducationText(applicationData.education)}\n` +
                 `**Mezun Olduğu Okul:** ${applicationData.school}\n` +
                 `**Askerlik Durumu:** ${getMilitaryServiceText(applicationData.militaryService)}\n\n` +
                 `**Sabıka Kaydı:** ${applicationData.criminalRecord === 'yes' ? 'Var' : 'Yok'}\n` +
                 `${applicationData.criminalRecord === 'yes' ? `**Sabıka Açıklaması:** ${applicationData.criminalRecordExplanation}\n\n` : '\n'}` +
                 `**Ehliyet:** ${applicationData.drivingLicense === 'yes' ? 'Var' : 'Yok'}\n\n` +
                 `**Neden LSPD'de Çalışmak İstiyor:**\n${applicationData.whyLSPD}\n\n` +
                 `**Beceriler ve Yetenekler:**\n${applicationData.skills}\n\n` +
                 `**Ek Bilgiler:**\n${applicationData.additionalInfo || 'Belirtilmemiş'}\n\n` +
                 `*LSPD Başvuru Sistemi - ${new Date().toLocaleString('tr-TR')}*`
    };
    
    // Webhook'a gönder
    sendToWebhook(Webhooks.lspd.link, webhookData);
    
    // Yerel depolamaya kaydet
    try {
        const applicationKey = 'lspd_application_' + new Date().getTime();
        const applicationDataStr = JSON.stringify({
            timestamp: new Date().toISOString(),
            data: applicationData
        });
        localStorage.setItem(applicationKey, applicationDataStr);
        console.log('LSPD başvurusu yerel olarak kaydedildi:', applicationKey);
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

// Yardımcı fonksiyonlar
function getGenderText(gender) {
    const genderMap = {
        'male': 'Erkek',
        'female': 'Kadın',
        'other': 'Diğer'
    };
    
    return genderMap[gender] || gender || 'Belirtilmemiş';
}

function getEducationText(education) {
    const educationMap = {
        'highSchool': 'Lise',
        'associate': 'Ön Lisans',
        'bachelor': 'Lisans',
        'master': 'Yüksek Lisans',
        'doctorate': 'Doktora'
    };
    
    return educationMap[education] || education || 'Belirtilmemiş';
}

function getMilitaryServiceText(militaryService) {
    const militaryServiceMap = {
        'completed': 'Tamamlandı',
        'exempt': 'Muaf',
        'deferred': 'Tecilli',
        'notApplicable': 'Uygulanabilir Değil'
    };
    
    return militaryServiceMap[militaryService] || militaryService || 'Belirtilmemiş';
}
