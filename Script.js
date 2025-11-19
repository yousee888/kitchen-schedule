document.addEventListener('DOMContentLoaded', () => {
    // 1. قائمة الأشخاص التسعة (محدثة بالأسماء والأرقام)
    const residents = [
        { name: 'مبارك', contact: '1769', fullNumber: '0503151769' },
        { name: 'نصرالدين', contact: '4552', fullNumber: '0507674552' },
        { name: 'احمد', contact: '0573', fullNumber: '0507700573' },
        { name: 'سعد', contact: '1638', fullNumber: '0500911638' },
        { name: 'سيف', contact: '5247', fullNumber: '0530695247' },
        { name: 'ناصر', contact: '8965', fullNumber: '0500788965' },
        { name: 'يوسف', contact: '3412', fullNumber: '0557953412' },
        { name: 'الامين', contact: '8048', fullNumber: '0503498048' },
        { name: 'عثمان', contact: '8560', fullNumber: '0503498560' }
    ];

    const taskList = document.getElementById('schedule-list');
    const nameInput = document.getElementById('name-input');
    const checkButton = document.getElementById('check-button');
    const resultMessage = document.getElementById('result-message');
    
    const daysNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

    // ******** مهم جداً: قم بتغيير هذا التاريخ ********
    // ضع هنا تاريخ أول يوم (أحد) بدأ فيه جدول النظافة الفعلي.
    const startDate = new Date('2025-01-05'); 
    
    
    // الدالة الرئيسية لحساب الجدول الدوري
    function calculateSchedule() {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        startDate.setHours(0, 0, 0, 0);

        const diffTime = Math.abs(today - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const dayIndex = (diffDays) % residents.length; 
        
        let schedule = [];
        for (let i = 0; i < 9; i++) {
            const currentDay = new Date(today);
            currentDay.setDate(today.getDate() + i);
            
            const scheduleIndex = (dayIndex + i) % residents.length;
            
            schedule.push({
                date: currentDay,
                dayName: daysNames[currentDay.getDay()],
                resident: residents[scheduleIndex].name
            });
        }
        return schedule;
    }

    // عرض الجدول في القائمة
    function renderSchedule() {
        const schedule = calculateSchedule();
        taskList.innerHTML = '';

        schedule.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>يوم ${item.dayName}، ${item.date.toLocaleDateString('ar-SA')}</span>
                <span>: <strong>${item.resident}</strong></span>
            `;
            if (index === 0) {
                listItem.classList.add('today');
            }
            taskList.appendChild(listItem);
        });
    }

    // دالة التحقق من اليوم للشخص
    function checkDuty() {
        const input = nameInput.value.trim();
        const schedule = calculateSchedule();
        let found = false;
        
        // البحث باستخدام الاسم أو آخر 4 أرقام أو الرقم الكامل
        const residentInfo = residents.find(r => r.name === input || r.contact === input || r.fullNumber === input);

        if (residentInfo) {
            const dutyDay = schedule.find(item => item.resident === residentInfo.name);

            if (dutyDay && dutyDay.date.toDateString() === new Date().toDateString()) {
                resultMessage.style.color = '#dc3545';
                resultMessage.innerHTML = `<strong>عليك اليوم يا ${residentInfo.name}! 📢</strong> لا تنسى تنظيف المطبخ.`;
                showEncouragement(); 
                found = true;
            } else if (dutyDay) {
                resultMessage.style.color = '#007bff';
                resultMessage.innerHTML = `يوم نظافتك القادم يا ${residentInfo.name} هو: <strong>${dutyDay.dayName}، ${dutyDay.date.toLocaleDateString('ar-SA')}</strong>.`;
                found = true;
            }
        }
        
        if (!found) {
             resultMessage.style.color = '#6c757d';
             resultMessage.innerHTML = `لم يتم العثور على اسم أو رقم مطابق.`;
        }
    }

    // رسالة "أتقن عملك" (تظهر بعد التحقق)
    function showEncouragement() {
        alert('أثناء النظافة: أتقن عملك! نظافة المطبخ تعكس راحة الجميع ✨');
    }

    // ربط الأحداث
    checkButton.addEventListener('click', checkDuty);
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkDuty();
        }
    });
    
    renderSchedule();
});