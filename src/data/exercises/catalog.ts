import type { Exercise } from '../../types';

export const EXERCISES_CATALOG: Exercise[] = [
  {
    id: 'dumbbell-thruster',
    name: {
      en: 'Dumbbell Thruster',
      tr: 'Dambıl Thruster (Squat + Pres)',
    },
    category: 'dumbbell',
    muscleGroups: ['full-body', 'legs', 'shoulders', 'core'],
    equipment: ['dumbbells'],
    difficulty: 'intermediate',
    defaultWorkSeconds: 35,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Hold a pair of dumbbells at shoulder height with palms facing each other.',
        'Lower into a deep squat while keeping your chest tall and knees tracking over toes.',
        'Drive explosively through your heels to stand up and press the dumbbells overhead in one fluid motion.',
        'Lower the dumbbells back to your shoulders with control and immediately begin the next rep.',
      ],
      tr: [
        'Avuç içleri birbirine bakacak şekilde dambılları omuz hizasında tutun.',
        'Göğsünüzü dik tutarak ve dizlerinizi ayak uçlarınızla hizalayarak derin squat pozisyonuna inin.',
        'Topuklarınızdan güç alarak hızla kalkın ve tek akıcı hareketle dambılları baş üstüne itin.',
        'Dambılları kontrollüce omuz hizasına indirin ve bir sonraki tekrara geçin.',
      ],
    },
    commonMistakes: {
      en: [
        'Pressing the weights with the arms before the hips and knees finish extending.',
        'Allowing the lower back to arch excessively at the top of the overhead press.',
      ],
      tr: [
        'Kalça ve dizler tam doğrulmadan önce ağırlıkları sadece kollarla itmeye çalışmak.',
        'Baş üstü presin en üst noktasında beli aşırı çukurlaştırmak.',
      ],
    },
    easierVariation: {
      en: 'Perform bodyweight squat to overhead reach without dumbbells, or use lighter weights.',
      tr: 'Dambıl olmadan vücut ağırlığıyla squat yapıp kolları yukarı uzatın veya daha hafif ağırlık seçin.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/dumbbell-thruster.gif',
      posterSrc: 'assets/exercises/dumbbell-thruster-poster.png',
      alt: {
        en: 'Athlete squatting with dumbbells at shoulders and pressing them overhead.',
        tr: 'Omuzlarda dambılla squat yapıp baş üstüne pres yapan sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'mountain-climbers',
    name: {
      en: 'Mountain Climbers',
      tr: 'Dağ Tırmanışı',
    },
    category: 'cardio',
    muscleGroups: ['core', 'shoulders', 'legs', 'cardio'],
    equipment: ['none'],
    difficulty: 'beginner',
    defaultWorkSeconds: 35,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Start in a strong high plank position with wrists directly beneath your shoulders.',
        'Brace your core and drive one knee rapidly toward your chest without lifting your hips.',
        'Quickly switch legs in a running motion while keeping your shoulders stable over your hands.',
      ],
      tr: [
        'Bilekleriniz tam omuzlarınızın altında olacak şekilde yüksek plank (şınav) pozisyonuna geçin.',
        'Karın kaslarınızı sıkın ve kalçanızı yukarı kaldırmadan bir dizinizi göğsünüze doğru çekin.',
        'Omuzlarınızı sabit tutarak bacaklarınızı koşu temposunda dönüşümlü olarak değiştirin.',
      ],
    },
    commonMistakes: {
      en: [
        'Bouncing the hips high in the air instead of keeping a flat plank line.',
        'Letting the shoulders drift backward behind the wrists.',
      ],
      tr: [
        'Vücudu düz bir çizgide tutmak yerine kalçayı yukarı doğru zıplatmak.',
        'Omuzların bileklerin gerisine kaymasına izin vermek.',
      ],
    },
    easierVariation: {
      en: 'Slow down the pace and step one foot forward at a time, or elevate hands on a sturdy bench.',
      tr: 'Tempoyu düşürerek dizleri tek tek çekin veya ellerinizi sağlam bir yükseltiye koyun.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/mountain-climbers.gif',
      posterSrc: 'assets/exercises/mountain-climbers-poster.png',
      alt: {
        en: 'Athlete in high plank position driving one knee toward the chest.',
        tr: 'Yüksek plank pozisyonunda bir dizini göğsüne çeken sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'romanian-deadlift-row',
    name: {
      en: 'Romanian Deadlift to Row',
      tr: 'Rumen Deadlift ve Sırt Çekiş',
    },
    category: 'dumbbell',
    muscleGroups: ['back', 'glutes', 'legs', 'core'],
    equipment: ['dumbbells'],
    difficulty: 'intermediate',
    defaultWorkSeconds: 35,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Stand tall with feet hip-width apart holding dumbbells in front of your thighs.',
        'Hinge at the hips by pushing your glutes back with a slight knee bend until your torso is near parallel.',
        'At the bottom of the hinge, row both dumbbells toward your lower ribs while squeezing your shoulder blades.',
        'Lower the arms, drive your hips forward to stand tall, and repeat.',
      ],
      tr: [
        'Ayaklar kalça genişliğinde açık, dambıllar uylukların önünde dik durun.',
        'Dizleri hafif büküp kalçayı geriye iterek gövdeniz yere paralel olana dek öne eğilin.',
        'Alt noktada kürek kemiklerinizi sıkarak dambılları alt kaburgalarınıza doğru çekin.',
        'Kolları uzatın, kalçanızı ileri iterek dik pozisyona dönün ve tekrarlayın.',
      ],
    },
    commonMistakes: {
      en: [
        'Rounding the upper or lower back during the hip hinge.',
        'Jerking the torso upward while rowing the dumbbells.',
      ],
      tr: [
        'Kalça menteşesi (hinge) sırasında sırtı veya beli kamburlaştırmak.',
        'Dambılları çekerken gövdeyi yukarı doğru savurmak.',
      ],
    },
    easierVariation: {
      en: 'Perform a standard hip hinge without the row or reduce the hinge depth.',
      tr: 'Çekiş eklemeden sadece kalça menteşesi yapın veya eğilme açısını azaltın.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/romanian-deadlift-row.gif',
      posterSrc: 'assets/exercises/romanian-deadlift-row-poster.png',
      alt: {
        en: 'Athlete hinged at the hips rowing two dumbbells toward the torso.',
        tr: 'Kalçadan öne eğilmiş pozisyonda iki dambılı gövdesine çeken sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'skater-jumps',
    name: {
      en: 'Skater Jumps',
      tr: 'Patenci Sıçrayışı',
    },
    category: 'cardio',
    muscleGroups: ['legs', 'glutes', 'cardio', 'core'],
    equipment: ['none'],
    difficulty: 'intermediate',
    defaultWorkSeconds: 35,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Start on the right side of your space with a slight bend in your knees.',
        'Push off your right foot to bound laterally to the left, landing softly on your left foot.',
        'Sweep your right leg behind your left ankle as your arms swing across your body like a speed skater.',
        'Immediately rebound to the right side and maintain a rhythmic lateral cadence.',
      ],
      tr: [
        'Alanınızın sağ tarafında dizleriniz hafif bükülü olarak başlayın.',
        'Sağ ayağınızla yeri iterek sola doğru yana sıçrayın ve sol ayağınızın üzerine yumuşakça inin.',
        'Kollarınızı bir sürat patencisi gibi sallarken sağ ayağınızı sol ayak bileğinizin arkasına götürün.',
        'Hemen sağ tarafa geri sıçrayarak ritmik bir yanal tempo yakalayın.',
      ],
    },
    commonMistakes: {
      en: [
        'Landing with a stiff, locked knee instead of absorbing impact through the hip and knee.',
        'Letting the landing knee cave inward (valgus).',
      ],
      tr: [
        'Darbeyi kalça ve dizle emmek yerine kilitli ve sert dizle yere inmek.',
        'Yere basan dizin içe doğru çökmesine izin vermek.',
      ],
    },
    easierVariation: {
      en: 'Perform wide lateral skater steps instead of jumping, tapping the back toe on the floor for balance.',
      tr: 'Sıçramak yerine geniş yan adımlar atın ve denge için arka ayak ucunu yere dokundurun.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/skater-jumps.gif',
      posterSrc: 'assets/exercises/skater-jumps-poster.png',
      alt: {
        en: 'Athlete bounding laterally from one leg to the other in a speed-skater motion.',
        tr: 'Bir bacaktan diğerine yana doğru patenci sıçrayışı yapan sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'reverse-lunge-knee-drive',
    name: {
      en: 'Reverse Lunge Knee Drive',
      tr: 'Geriye Hamle ve Diz Çekiş',
    },
    category: 'bodyweight',
    muscleGroups: ['legs', 'glutes', 'core'],
    equipment: ['none'],
    difficulty: 'beginner',
    defaultWorkSeconds: 35,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Stand tall with feet hip-width apart and core engaged.',
        'Step one foot backward and lower until both knees form roughly 90-degree angles.',
        'Press firmly through your front heel to stand up and drive the back knee high toward your chest.',
        'Alternate legs halfway through the interval or switch legs on every repetition.',
      ],
      tr: [
        'Ayaklar kalça genişliğinde açık ve merkez bölgesi aktif şekilde dik durun.',
        'Bir ayağınızla geriye adım atın ve her iki diziniz yaklaşık 90 derece olana kadar alçalın.',
        'Ön topuğunuzla yeri güçlüce iterek kalkın ve arka dizinizi göğsünüze doğru yukarı çekin.',
        'Her tekrarda bacak değiştirin veya sürenin yarısında diğer bacağa geçin.',
      ],
    },
    commonMistakes: {
      en: [
        'Leaning the torso too far forward over the front thigh.',
        'Walking on a tightrope instead of keeping feet hip-width apart during the step back.',
      ],
      tr: [
        'Gövdeyi ön bacağın üzerine aşırı yatırmak.',
        'Geriye adım atarken ayakları kalça genişliğinde tutmak yerine tek çizgiye basmak.',
      ],
    },
    easierVariation: {
      en: 'Step back into a shallow reverse lunge and return to standing with both feet together before driving the knee.',
      tr: 'Daha az derinlikte geriye hamle yapın ve diz çekmeden önce iki ayağı yan yana getirerek dengelenin.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/reverse-lunge-knee-drive.gif',
      posterSrc: 'assets/exercises/reverse-lunge-knee-drive-poster.png',
      alt: {
        en: 'Athlete stepping back into a reverse lunge and driving the knee upward.',
        tr: 'Geriye lunge hamlesinden kalkarken dizini yukarı çeken sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'burpees',
    name: {
      en: 'Burpees',
      tr: 'Burpee',
    },
    category: 'cardio',
    muscleGroups: ['full-body', 'cardio', 'chest', 'legs', 'core'],
    equipment: ['none'],
    difficulty: 'advanced',
    defaultWorkSeconds: 35,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Stand with feet shoulder-width apart, then squat down and place both hands flat on the floor.',
        'Jump or step both feet back into a solid high plank position while bracing your core.',
        'Perform an optional push-up or immediately jump your feet back outside your hands.',
        'Explode upward into a vertical jump with hands reaching overhead, landing softly on your midfoot.',
      ],
      tr: [
        'Ayaklar omuz genişliğinde açık durun, çömelerek ellerinizi yere tam yerleştirin.',
        'Karın kaslarınızı sıkarak ayaklarınızı geriye sıçratın (veya adımlayın) ve sağlam bir plank pozisyonu alın.',
        'İsteğe bağlı şınav çekin veya hemen ayaklarınızı ellerinizin dışına doğru geri sıçratın.',
        'Kollarınızı baş üstüne uzatarak dikey sıçrayın ve dizlerinizi yumuşatarak yere inin.',
      ],
    },
    commonMistakes: {
      en: [
        'Letting the lower back sag toward the floor when jumping back into the plank.',
        'Jumping feet back in with heels lifted instead of landing flat-footed outside the hands.',
      ],
      tr: [
        'Plank pozisyonuna sıçrarken belin aşağı sarkmasına izin vermek.',
        'Ayakları öne çekerken topukları havada bırakmak yerine ellerin dışına tam basmamak.',
      ],
    },
    easierVariation: {
      en: 'No-Push-Up Walkout Burpee: step feet back and forward one at a time and finish with a calf raise instead of a jump.',
      tr: 'Sıçramasız Burpee: ayakları tek tek geriye ve öne adımlayın, sonunda sıçramak yerine parmak ucuna yükselin.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/burpees.gif',
      posterSrc: 'assets/exercises/burpees-poster.png',
      alt: {
        en: 'Sequence of plank drop and explosive vertical jump for a burpee.',
        tr: 'Plank ve dikey sıçrama aşamalarını gösteren burpee illüstrasyonu.',
      },
    },
  },
  {
    id: 'push-ups',
    name: {
      en: 'Push-Ups',
      tr: 'Şınav (Push-Up)',
    },
    category: 'bodyweight',
    muscleGroups: ['chest', 'shoulders', 'arms', 'core'],
    equipment: ['none'],
    difficulty: 'beginner',
    defaultWorkSeconds: 35,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Place hands slightly wider than shoulder-width apart and form a straight line from head to heels.',
        'Lower your chest toward the floor by bending elbows at roughly a 45-degree angle to your torso.',
        'Press firmly through your palms to return to the top plank position without locking elbows.',
      ],
      tr: [
        'Ellerinizi omuz genişliğinden biraz daha açık yerleştirin ve baştan topuklara düz bir çizgi oluşturun.',
        'Dirseklerinizi gövdenizle yaklaşık 45 derece açı yapacak şekilde bükerek göğsünüzü yere yaklaştırın.',
        'Avuç içlerinizle yeri güçlüce iterek başlangıç plank pozisyonuna dönün.',
      ],
    },
    commonMistakes: {
      en: [
        'Flaring elbows out at a 90-degree T-shape, which stresses the shoulder joints.',
        'Dropping the head or hips before the chest reaches the bottom.',
      ],
      tr: [
        'Dirsekleri 90 derece yana açarak omuz eklemlerine aşırı yük bindirmek.',
        'Göğüs yere yaklaşmadan başı veya kalçayı aşağı düşürmek.',
      ],
    },
    easierVariation: {
      en: 'Perform incline push-ups with hands on a bench/wall, or lower your knees to the mat.',
      tr: 'Ellerinizi bir sehpa/duvara koyarak eğimli şınav çekin veya dizlerinizi mata koyun.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/push-ups.gif',
      posterSrc: 'assets/exercises/push-ups-poster.png',
      alt: {
        en: 'Athlete performing a push-up with a straight body line from head to heels.',
        tr: 'Baştan topuklara düz bir vücut hattıyla şınav çeken sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'air-squats',
    name: {
      en: 'Bodyweight Squats',
      tr: 'Vücut Ağırlığı Squat',
    },
    category: 'bodyweight',
    muscleGroups: ['legs', 'glutes', 'core'],
    equipment: ['none'],
    difficulty: 'beginner',
    defaultWorkSeconds: 40,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Stand with feet shoulder-width apart and toes turned slightly outward (10 to 15 degrees).',
        'Send your hips back and bend your knees to lower until your thighs are at least parallel to the floor.',
        'Keep your chest proud and heels planted, then drive back up to a full standing position.',
      ],
      tr: [
        'Ayaklar omuz genişliğinde açık, ayak uçları hafif dışa dönük (10-15 derece) dik durun.',
        'Kalçanızı geriye gönderip dizlerinizi bükerek uyluklarınız yere paralel olana kadar inin.',
        'Göğsünüzü dik ve topuklarınızı yerde tutarak başlangıç pozisyonuna yükselin.',
      ],
    },
    commonMistakes: {
      en: [
        'Lifting the heels off the floor at the bottom of the squat.',
        'Allowing the knees to collapse inward when standing up.',
      ],
      tr: [
        'Squatın alt noktasında topukların yerden kalkması.',
        'Yukarı kalkarken dizlerin birbirine doğru içe çökmesi.',
      ],
    },
    easierVariation: {
      en: 'Box Squat: squat down lightly to touch a chair or bench behind you, then stand back up.',
      tr: 'Kutu Squat: arkanızdaki bir sandalye veya sehpaya hafifçe dokunup tekrar ayağa kalkın.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/air-squats.gif',
      posterSrc: 'assets/exercises/air-squats-poster.png',
      alt: {
        en: 'Athlete performing a deep bodyweight squat with arms extended forward for balance.',
        tr: 'Denge için kolları önde derin squat yapan sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'plank-hold',
    name: {
      en: 'Forearm Plank Hold',
      tr: 'Ön Kol Plank Duruşu',
    },
    category: 'core',
    muscleGroups: ['core', 'shoulders', 'glutes'],
    equipment: ['mat'],
    difficulty: 'beginner',
    defaultWorkSeconds: 40,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Place your forearms on the mat with elbows aligned directly underneath your shoulders.',
        'Extend both legs behind you and brace your abs, glutes, and quads to form a rigid plank.',
        'Breathe steadily through your nose and maintain neutral neck alignment looking between your hands.',
      ],
      tr: [
        'Dirsekleriniz tam omuzlarınızın altında olacak şekilde ön kollarınızı mata yerleştirin.',
        'Bacaklarınızı geriye uzatın; karın, kalça ve bacak kaslarınızı sıkarak düz bir hat oluşturun.',
        'Düzenli nefes alıp verin ve bakışlarınızı ellerinizin arasında tutarak boynunuzu nötr koruyun.',
      ],
    },
    commonMistakes: {
      en: [
        'Holding your breath instead of breathing rhythmically while bracing.',
        'Allowing the hips to sag or piking them up into an inverted V.',
      ],
      tr: [
        'Karın kaslarını sıkarken nefesi tutmak.',
        'Kalçanın aşağı sarkmasına veya ters V şeklinde yukarı kalkmasına izin vermek.',
      ],
    },
    easierVariation: {
      en: 'Drop your knees to the mat while keeping a straight line from shoulders to knees.',
      tr: 'Omuzlardan dizlere düz çizgiyi koruyarak dizlerinizi mata koyun.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/plank-hold.gif',
      posterSrc: 'assets/exercises/plank-hold-poster.png',
      alt: {
        en: 'Athlete holding an isometric forearm plank with engaged core.',
        tr: 'Ön kolları üzerinde izometrik plank duruşu yapan sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'jumping-jacks',
    name: {
      en: 'Jumping Jacks',
      tr: 'Jumping Jack (Yıldız Sıçrayışı)',
    },
    category: 'cardio',
    muscleGroups: ['full-body', 'cardio', 'shoulders', 'legs'],
    equipment: ['none'],
    difficulty: 'beginner',
    defaultWorkSeconds: 35,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Stand upright with feet together and arms relaxed at your sides.',
        'Jump your feet out wider than shoulder-width while sweeping both arms overhead.',
        'Lightly jump your feet back together while bringing your arms back down to your sides.',
      ],
      tr: [
        'Ayaklar bitişik ve kollar yanlarda rahat bir şekilde dik durun.',
        'Ayaklarınızı omuz genişliğinden dışarı sıçratırken kollarınızı baş üstünde birleştirin.',
        'Yumuşakça sıçrayarak ayaklarınızı tekrar birleştirin ve kollarınızı yanlara indirin.',
      ],
    },
    commonMistakes: {
      en: [
        'Slamming the heels loudly onto the floor instead of landing softly on the balls of the feet.',
        'Shrugging shoulders up toward the ears during the overhead arm sweep.',
      ],
      tr: [
        'Ayak parmak kökleri üzerine yumuşak inmek yerine topukları sertçe yere vurmak.',
        'Kolları kaldırırken omuzları kulaklara doğru çekmek.',
      ],
    },
    easierVariation: {
      en: 'Step Jacks: step one foot out to the side at a time while raising both arms overhead.',
      tr: 'Step Jack: sıçramadan sırayla bir ayağınızı yana açarken kollarınızı yukarı kaldırın.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/jumping-jacks.gif',
      posterSrc: 'assets/exercises/jumping-jacks-poster.png',
      alt: {
        en: 'Athlete performing jumping jacks with feet wide and arms overhead.',
        tr: 'Kollar baş üstünde ve bacaklar açık jumping jack yapan sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'dumbbell-goblet-squat',
    name: {
      en: 'Dumbbell Goblet Squat',
      tr: 'Dambıl Goblet Squat',
    },
    category: 'dumbbell',
    muscleGroups: ['legs', 'glutes', 'core'],
    equipment: ['dumbbells'],
    difficulty: 'beginner',
    defaultWorkSeconds: 40,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Cup the top end of a single dumbbell vertically against your chest like a goblet, elbows pointing down.',
        'Sit your hips back and down between your knees while keeping your spine tall.',
        'Drive through your mid-foot and heels to stand tall and squeeze your glutes at the top.',
      ],
      tr: [
        'Tek bir dambılı dikey olarak göğsünüzün önünde kadeh gibi kavrayın, dirsekler aşağı baksın.',
        'Omurganızı dik tutarak kalçanızı geriye ve aşağı doğru indirin.',
        'Topuklarınızdan güç alarak dik konuma yükselin ve üst noktada kalçanızı sıkın.',
      ],
    },
    commonMistakes: {
      en: [
        'Holding the dumbbell away from the chest, which strains the arms and upper back.',
        'Rounding the upper back at the bottom of the squat.',
      ],
      tr: [
        'Dambılı göğüsten uzakta tutarak kollara ve sırta gereksiz yük bindirmek.',
        'Squatın en alt noktasında sırtı kamburlaştırmak.',
      ],
    },
    easierVariation: {
      en: 'Use a lighter dumbbell or perform bodyweight squats.',
      tr: 'Daha hafif bir dambıl kullanın veya vücut ağırlığıyla squat yapın.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/dumbbell-goblet-squat.gif',
      posterSrc: 'assets/exercises/dumbbell-goblet-squat-poster.png',
      alt: {
        en: 'Athlete holding one vertical dumbbell at chest height while squatting.',
        tr: 'Göğüs hizasında dikey dambıl tutarak squat yapan sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'bicycle-crunches',
    name: {
      en: 'Bicycle Crunches',
      tr: 'Bisiklet Mekik',
    },
    category: 'core',
    muscleGroups: ['core'],
    equipment: ['mat'],
    difficulty: 'beginner',
    defaultWorkSeconds: 35,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Lie flat on your back with lower back pressed into the mat and fingertips lightly behind your ears.',
        'Lift your shoulder blades off the mat and bring knees to a tabletop position.',
        'Rotate your torso to bring your right shoulder toward your left knee while extending the right leg straight.',
        'Switch sides in a smooth, controlled pedaling motion.',
      ],
      tr: [
        'Sırtüstü uzanın, belinizi mata bastırın ve parmak uçlarınızı kulaklarınızın arkasına hafifçe yerleştirin.',
        'Kürek kemiklerinizi mattan kaldırın ve dizlerinizi masa pozisyonuna getirin.',
        'Sağ bacağınızı ileri uzatırken gövdenizi döndürerek sağ omzunuzu sol dizinize yaklaştırın.',
        'Kontrollü bir pedal çevirme hareketiyle yön değiştirerek devam edin.',
      ],
    },
    commonMistakes: {
      en: [
        'Pulling aggressively on the back of the neck with the hands instead of rotating from the ribs.',
        'Spinning the legs wildly without actually rotating the shoulders.',
      ],
      tr: [
        'Gövdeyi döndürmek yerine ellerle boynu öne doğru çekmek.',
        'Omuzları döndürmeden sadece bacakları hızlıca sallamak.',
      ],
    },
    easierVariation: {
      en: 'Keep feet on the floor and lift one knee at a time as you rotate the opposite shoulder.',
      tr: 'Ayaklarınızı yerde tutun ve karşı omzunuzu döndürürken her seferinde tek dizinizi kaldırın.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/bicycle-crunches.gif',
      posterSrc: 'assets/exercises/bicycle-crunches-poster.png',
      alt: {
        en: 'Athlete lying on mat rotating torso to touch elbow to opposite knee.',
        tr: 'Mat üzerinde gövdesini döndürerek dirseğini çapraz dizine yaklaştıran sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'glute-bridges',
    name: {
      en: 'Glute Bridges',
      tr: 'Kalça Köprüsü (Glute Bridge)',
    },
    category: 'low-impact',
    muscleGroups: ['glutes', 'legs', 'core'],
    equipment: ['mat'],
    difficulty: 'beginner',
    defaultWorkSeconds: 40,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Lie on your back with knees bent, feet flat on the floor hip-width apart, and arms by your sides.',
        'Press through your heels to lift your hips until knees, hips, and shoulders form a straight diagonal line.',
        'Squeeze your glutes for 1 second at the top, then lower down with control.',
      ],
      tr: [
        'Dizler bükülü, ayaklar kalça genişliğinde yerde ve kollar yanlarda olacak şekilde sırtüstü uzanın.',
        'Topuklarınızdan güç alarak diz, kalça ve omuzlarınız düz bir çizgi oluşturana dek kalçanızı kaldırın.',
        'Üst noktada kalçanızı 1 saniye sıkın ve kontrollüce yere indirin.',
      ],
    },
    commonMistakes: {
      en: [
        'Hyperextending the lower back instead of driving hip extension with the glutes.',
        'Pushing from the toes instead of the heels.',
      ],
      tr: [
        'Hareketi kalçadan yapmak yerine beli aşırı yukarı bükerek zorlamak.',
        'Topuklar yerine ayak parmak uçlarından güç almak.',
      ],
    },
    easierVariation: {
      en: 'Reduce the range of motion and focus on a gentle pelvic tilt and glute squeeze.',
      tr: 'Hareket açıklığını azaltarak pelvik tilt ve kalça sıkıştırmaya odaklanın.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/glute-bridges.gif',
      posterSrc: 'assets/exercises/glute-bridges-poster.png',
      alt: {
        en: 'Athlete lying supine with knees bent and hips lifted into a bridge.',
        tr: 'Sırtüstü yatarken kalçasını yukarı kaldırarak köprü kuran sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'high-knees',
    name: {
      en: 'High Knees Sprint',
      tr: 'Yüksek Diz Koşusu (High Knees)',
    },
    category: 'cardio',
    muscleGroups: ['cardio', 'legs', 'core'],
    equipment: ['none'],
    difficulty: 'intermediate',
    defaultWorkSeconds: 30,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Stand tall with feet hip-width apart and elbows bent at 90 degrees by your sides.',
        'Run in place while driving your knees up to hip height on every stride.',
        'Pump your opposite arm with each knee drive and stay light on the balls of your feet.',
      ],
      tr: [
        'Ayaklar kalça genişliğinde açık ve dirsekler 90 derece bükülü dik durun.',
        'Olduğunuz yerde koşarken her adımda dizlerinizi kalça hizasına kadar çekin.',
        'Ayak parmak köklerinizde hafif kalarak çapraz kollarınızı ritmik şekilde sallayın.',
      ],
    },
    commonMistakes: {
      en: [
        'Leaning backward while trying to lift the knees higher.',
        'Landing heavily on flat feet.',
      ],
      tr: [
        'Dizleri daha yükseğe çekmek için gövdeyi geriye yatırmak.',
        'Yere tüm tabanla sert şekilde basmak.',
      ],
    },
    easierVariation: {
      en: 'High Knee March: march briskly in place driving one knee up at a time without jumping.',
      tr: 'Yüksek Diz Yürüyüşü: sıçramadan, tempolu yürüyüşle dizleri sırayla yukarı çekin.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/high-knees.gif',
      posterSrc: 'assets/exercises/high-knees-poster.png',
      alt: {
        en: 'Athlete sprinting in place driving one knee high above waist level.',
        tr: 'Olduğu yerde dizlerini bel hizasına çekerek koşan sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'dumbbell-renegade-row',
    name: {
      en: 'Dumbbell Renegade Row',
      tr: 'Plank Pozisyonunda Dambıl Çekiş',
    },
    category: 'dumbbell',
    muscleGroups: ['back', 'core', 'shoulders', 'arms'],
    equipment: ['dumbbells', 'mat'],
    difficulty: 'advanced',
    defaultWorkSeconds: 35,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Start in a high plank gripping two hex dumbbells on the floor with your feet set wide for stability.',
        'Brace your core and glutes to lock your hips parallel to the floor.',
        'Row one dumbbell up toward your hip while pressing the supporting hand firmly into the floor.',
        'Lower the dumbbell with control and row with the opposite arm.',
      ],
      tr: [
        'Denge için ayaklarınızı geniş açarak ellerinizde dambıllarla yüksek plank pozisyonu alın.',
        'Kalçanızı yere paralel sabitlemek için karın ve kalça kaslarınızı sıkın.',
        'Destek elinizle yeri iterken diğer elinizdeki dambılı kalçanıza doğru çekin.',
        'Dambılı kontrollüce yere indirin ve diğer kolla tekrarlayın.',
      ],
    },
    commonMistakes: {
      en: [
        'Twisting the torso and hips open toward the rowing arm.',
        'Placing feet too close together, which causes loss of balance.',
      ],
      tr: [
        'Çekiş yapılan tarafa doğru kalçayı ve gövdeyi döndürmek.',
        'Ayakları birbirine çok yakın tutarak dengeyi kaybetmek.',
      ],
    },
    easierVariation: {
      en: 'Drop your knees to the mat in a modified plank position while performing alternating rows.',
      tr: 'Alternatif çekişleri yaparken dizlerinizi mata koyarak destekli plank pozisyonunda çalışın.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/dumbbell-renegade-row.gif',
      posterSrc: 'assets/exercises/dumbbell-renegade-row-poster.png',
      alt: {
        en: 'Athlete in wide-stance plank rowing one dumbbell while stabilizing on the other.',
        tr: 'Geniş ayaklı plank pozisyonunda tek kolla dambıl çekişi yapan sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'russian-twists',
    name: {
      en: 'Russian Twists',
      tr: 'Rus Dönüşü (Russian Twist)',
    },
    category: 'core',
    muscleGroups: ['core'],
    equipment: ['mat'],
    difficulty: 'beginner',
    defaultWorkSeconds: 35,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Sit on the mat with knees bent and heels lightly touching the floor, leaning back to a 45-degree angle.',
        'Clasp your hands together in front of your chest and lengthen your spine.',
        'Rotate your torso from side to side, bringing your hands beside each hip with control.',
      ],
      tr: [
        'Mat üzerine oturun, dizlerinizi bükün, topuklarınızı hafifçe yere değdirin ve gövdenizi 45 derece geriye yaslayın.',
        'Ellerinizi göğsünüzün önünde birleştirin ve omurganızı dik tutun.',
        'Gövdenizi kontrollü bir şekilde sağa ve sola döndürerek ellerinizi kalçanızın yanına yaklaştırın.',
      ],
    },
    commonMistakes: {
      en: [
        'Moving only the arms side to side while keeping the chest facing forward.',
        'Slouching the lower back into a deep C-curve.',
      ],
      tr: [
        'Göğsü sabit tutup sadece kolları sağa sola sallamak.',
        'Beli kamburlaştırarak omurgaya baskı yapmak.',
      ],
    },
    easierVariation: {
      en: 'Keep both feet planted firmly on the mat and reduce the backward lean angle.',
      tr: 'Her iki ayağınızı mata tam basın ve geriye yaslanma açısını azaltın.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/russian-twists.gif',
      posterSrc: 'assets/exercises/russian-twists-poster.png',
      alt: {
        en: 'Athlete seated in V-sit position rotating torso side to side.',
        tr: 'V-oturuş pozisyonunda gövdesini sağa ve sola döndüren sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'shadow-boxing-punches',
    name: {
      en: 'Fast Shadow Boxing',
      tr: 'Hızlı Gölge Boksu',
    },
    category: 'low-impact',
    muscleGroups: ['shoulders', 'arms', 'core', 'cardio'],
    equipment: ['none'],
    difficulty: 'beginner',
    defaultWorkSeconds: 35,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Take an athletic boxing stance with knees soft, core braced, and hands guarding your cheekbones.',
        'Throw rapid, crisp straight punches (jab-cross) at shoulder height while rotating through your hips and core.',
        'Exhale sharply with each punch Combination and keep your shoulders relaxed.',
      ],
      tr: [
        'Dizler hafif bükülü, karın sıkı ve eller elmacık kemiklerini koruyacak şekilde boks gardı alın.',
        'Kalça ve merkez bölgenizi döndürerek omuz hizasında hızlı ve net düz yumruklar (direkt) çıkarın.',
        'Her yumruk kombinasyonunda keskin nefes verin ve omuzlarınızı gevşek tutun.',
      ],
    },
    commonMistakes: {
      en: [
        'Hyperextending and snapping the elbow joints at full extension.',
        'Standing flat-footed with locked knees.',
      ],
      tr: [
        'Yumruk sonunda dirsek eklemini sertçe kilitlemek.',
        'Dizleri kilitleyerek hareketsiz durmak.',
      ],
    },
    easierVariation: {
      en: 'Punch at a moderate rhythm focusing on full torso rotation and breathing.',
      tr: 'Tam gövde rotasyonuna ve nefese odaklanarak orta tempoda yumruk çıkarın.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/shadow-boxing-punches.gif',
      posterSrc: 'assets/exercises/shadow-boxing-punches-poster.png',
      alt: {
        en: 'Athlete in athletic stance throwing rapid straight punches.',
        tr: 'Atletik duruşta hızlı düz yumruklar çıkaran sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'inchworm-walkout',
    name: {
      en: 'Inchworm Walkout',
      tr: 'Solucan Yürüyüşü (Inchworm)',
    },
    category: 'low-impact',
    muscleGroups: ['full-body', 'core', 'shoulders', 'legs'],
    equipment: ['mat'],
    difficulty: 'beginner',
    defaultWorkSeconds: 40,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Stand tall at the back edge of your mat with feet hip-width apart.',
        'Hinge forward (bending knees slightly if needed) to place your palms on the mat.',
        'Walk your hands forward step by step until you reach a strong high plank position.',
        'Walk your hands back toward your feet and stand up tall to complete the rep.',
      ],
      tr: [
        'Matınızın arka ucunda ayaklar kalça genişliğinde açık dik durun.',
        'Gerekirse dizlerinizi hafif bükerek öne eğilin ve avuç içlerinizi mata koyun.',
        'Yüksek plank pozisyonuna ulaşana kadar ellerinizle adım adım ileri yürüyün.',
        'Ellerinizle tekrar ayaklarınıza doğru geriye yürüyün ve dik konuma yükselin.',
      ],
    },
    commonMistakes: {
      en: [
        'Wiggling the hips excessively side to side while walking the hands out.',
        'Walking the hands past the shoulders without bracing the core.',
      ],
      tr: [
        'Ellerle yürürken kalçayı sağa sola aşırı sallamak.',
        'Karın kaslarını sıkmadan elleri omuz hizasının çok ilerisine taşımak.',
      ],
    },
    easierVariation: {
      en: 'Bend your knees generously as you transition from standing to the floor and back.',
      tr: 'Yere inerken ve kalkarken dizlerinizi rahatça bükün.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/inchworm-walkout.gif',
      posterSrc: 'assets/exercises/inchworm-walkout-poster.png',
      alt: {
        en: 'Athlete walking hands forward from standing fold into a high plank.',
        tr: 'Ayakta duruştan elleriyle yürüyerek yüksek plank pozisyonuna geçen sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'dumbbell-overhead-press',
    name: {
      en: 'Dumbbell Overhead Press',
      tr: 'Dambıl Omuz Pres',
    },
    category: 'dumbbell',
    muscleGroups: ['shoulders', 'arms', 'core'],
    equipment: ['dumbbells'],
    difficulty: 'beginner',
    defaultWorkSeconds: 35,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Stand with feet hip-width apart holding dumbbells at shoulder level with elbows slightly forward (scapular plane).',
        'Squeeze your glutes and ribs down, then press both dumbbells vertically overhead until arms are extended.',
        'Lower the weights slowly back to shoulder height under control.',
      ],
      tr: [
        'Ayaklar kalça genişliğinde açık, dirsekler hafif önde olacak şekilde dambılları omuz hizasında tutun.',
        'Kalça ve karın kaslarınızı sıkarak dambılları kollarınız uzayana dek baş üstüne itin.',
        'Ağırlıkları kontrollü bir şekilde tekrar omuz hizasına indirin.',
      ],
    },
    commonMistakes: {
      en: [
        'Leaning backward and flaring the ribcage to force the weights up.',
        'Stopping halfway down instead of returning dumbbells to shoulder level.',
      ],
      tr: [
        'Ağırlıkları kaldırmak için göğüs kafesini açıp beli geriye bükmek.',
        'Dambılları omuz hizasına kadar indirmeden yarı yolda durmak.',
      ],
    },
    easierVariation: {
      en: 'Press one dumbbell at a time (alternating overhead press) for reduced spinal load.',
      tr: 'Omurga yükünü azaltmak için dambılları sırayla (alternatif) yukarı itin.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/dumbbell-overhead-press.gif',
      posterSrc: 'assets/exercises/dumbbell-overhead-press-poster.png',
      alt: {
        en: 'Athlete standing tall pressing two dumbbells straight overhead.',
        tr: 'Dik duruşta iki dambılı baş üstüne presleyen sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'flutter-kicks',
    name: {
      en: 'Flutter Kicks',
      tr: 'Makas Tekme (Flutter Kicks)',
    },
    category: 'core',
    muscleGroups: ['core', 'legs'],
    equipment: ['mat'],
    difficulty: 'intermediate',
    defaultWorkSeconds: 35,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Lie on your back with legs extended and place your hands palms-down beneath your lower glutes for support.',
        'Press your lower back firmly into the mat and lift your heels 15 to 25 cm off the floor.',
        'Flutter your legs up and down in small, rapid alternating kicks while keeping knees mostly straight.',
      ],
      tr: [
        'Sırtüstü uzanın, destek için avuç içlerinizi kalçanızın alt kısmına yerleştirin.',
        'Belinizi mata sıkıca bastırın ve topuklarınızı yerden 15-25 cm kaldırın.',
        'Dizlerinizi düz tutarak bacaklarınızı küçük ve seri hareketlerle aşağı yukarı çırpın.',
      ],
    },
    commonMistakes: {
      en: [
        'Allowing the lower back to arch off the mat as the legs fatigue.',
        'Lowering the legs too close to the floor at the expense of lumbar stability.',
      ],
      tr: [
        'Bacaklar yoruldukça belin mattan kalkmasına izin vermek.',
        'Bel kontrolünü kaybedecek kadar bacakları yere fazla yaklaştırmak.',
      ],
    },
    easierVariation: {
      en: 'Raise your legs to a higher 45-to-60-degree angle to keep the lower back flat on the mat.',
      tr: 'Belinizi matta düz tutmak için bacaklarınızı yerden 45-60 derece daha yüksek bir açıda çalıştırın.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/flutter-kicks.gif',
      posterSrc: 'assets/exercises/flutter-kicks-poster.png',
      alt: {
        en: 'Athlete lying on mat performing alternating straight-leg flutter kicks.',
        tr: 'Sırtüstü pozisyonda bacaklarını sırayla aşağı yukarı çırpan sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'step-jack-low-impact',
    name: {
      en: 'Low-Impact Step Jacks',
      tr: 'Sıçramasız Step Jack',
    },
    category: 'low-impact',
    muscleGroups: ['full-body', 'cardio', 'shoulders'],
    equipment: ['none'],
    difficulty: 'beginner',
    defaultWorkSeconds: 35,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Stand tall with feet together and core lightly braced.',
        'Step your right foot wide to the side while sweeping both arms overhead.',
        'Return your right foot to center while lowering your arms, then immediately step out with your left foot.',
      ],
      tr: [
        'Ayaklar bitişik ve merkez bölgesi hafif sıkı şekilde dik durun.',
        'Sağ ayağınızı yana doğru genişçe açarken her iki kolunuzu baş üstüne kaldırın.',
        'Sağ ayağınızı merkeze çekip kollarınızı indirin, ardından hemen sol ayağınızla yana adım atın.',
      ],
    },
    commonMistakes: {
      en: [
        'Taking tiny steps instead of stepping out wide enough to engage the hips and legs.',
        'Moving arms half-way instead of full overhead extension.',
      ],
      tr: [
        'Kalça ve bacakları çalıştıracak genişlikte adım atmak yerine çok küçük adımlar atmak.',
        'Kolları tam baş üstüne uzatmadan yarıda bırakmak.',
      ],
    },
    easierVariation: {
      en: 'Perform the side steps with hands on hips if your shoulders are fatigued.',
      tr: 'Omuzlarınız yorulduysa ellerinizi belinize koyarak sadece yan adımlara odaklanın.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/step-jack-low-impact.gif',
      posterSrc: 'assets/exercises/step-jack-low-impact-poster.png',
      alt: {
        en: 'Athlete stepping one foot laterally while reaching both arms overhead.',
        tr: 'Bir ayağını yana adım atarken iki kolunu yukarı uzatan sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'plank-shoulder-taps',
    name: {
      en: 'Plank Shoulder Taps',
      tr: 'Plank Omuz Dokunuşu',
    },
    category: 'bodyweight',
    muscleGroups: ['core', 'shoulders', 'arms'],
    equipment: ['mat'],
    difficulty: 'intermediate',
    defaultWorkSeconds: 35,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Assume a high plank position with hands under shoulders and feet slightly wider than shoulder-width.',
        'Brace your abs and glutes hard to prevent any hip sway.',
        'Lift your right hand to gently tap your left shoulder, place it back down, and tap your right shoulder with your left hand.',
      ],
      tr: [
        'Eller omuzların altında, ayaklar omuz genişliğinden biraz daha açık yüksek plank pozisyonu alın.',
        'Kalçanın sallanmasını önlemek için karın ve kalça kaslarınızı sıkıca kilitleyin.',
        'Sağ elinizle sol omzunuza dokunup elinizi yere koyun, ardından sol elinizle sağ omzunuza dokunun.',
      ],
    },
    commonMistakes: {
      en: [
        'Rushing the taps and rocking the hips violently from side to side.',
        'Setting the feet too narrow to resist rotation.',
      ],
      tr: [
        'Hareketi çok hızlı yapıp kalçayı sağa sola savurmak.',
        'Dönüş direncini zorlaştıracak şekilde ayakları çok dar tutmak.',
      ],
    },
    easierVariation: {
      en: 'Perform shoulder taps from a kneeling plank position.',
      tr: 'Omuz dokunuşlarını dizler yerde destekli plank pozisyonunda uygulayın.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/plank-shoulder-taps.gif',
      posterSrc: 'assets/exercises/plank-shoulder-taps-poster.png',
      alt: {
        en: 'Athlete in high plank tapping opposite shoulder with one hand while hips stay level.',
        tr: 'Kalçasını sabit tutarak plank pozisyonunda çapraz omzuna dokunan sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'sumo-squat-pulse',
    name: {
      en: 'Sumo Squat Pulses',
      tr: 'Sumo Squat Yaylanma (Pulse)',
    },
    category: 'low-impact',
    muscleGroups: ['legs', 'glutes', 'core'],
    equipment: ['none'],
    difficulty: 'beginner',
    defaultWorkSeconds: 35,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Stand in a wide stance with toes pointed outward at roughly 45 degrees.',
        'Lower your hips into a wide sumo squat, keeping your knees aligned in the same direction as your toes.',
        'Stay in the bottom third of the squat and pulse up and down a few inches with steady tension.',
      ],
      tr: [
        'Ayaklerinizi geniş açın ve ayak uçlarınızı yaklaşık 45 derece dışa çevirin.',
        'Dizlerinizi ayak uçlarınızla aynı yönde tutarak geniş sumo squat pozisyonuna inin.',
        'Squatın alt bölgesinde kalarak kas gerilimini bozmadan birkaç santimetre yukarı aşağı yaylanın.',
      ],
    },
    commonMistakes: {
      en: [
        'Tipping the torso forward instead of keeping the spine vertical.',
        'Bouncing rapidly with momentum rather than controlled muscular pulses.',
      ],
      tr: [
        'Omurgayı dik tutmak yerine gövdeyi öne yatırmak.',
        'Kas kontrolü yerine ivmeyle kontrolsüzce zıplamak.',
      ],
    },
    easierVariation: {
      en: 'Perform full range-of-motion sumo squats standing all the way up between reps to release tension.',
      tr: 'Gerilimi azaltmak için her tekrarda tam ayağa kalkarak normal sumo squat yapın.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/sumo-squat-pulse.gif',
      posterSrc: 'assets/exercises/sumo-squat-pulse-poster.png',
      alt: {
        en: 'Athlete in wide sumo squat stance pulsing at the bottom of the movement.',
        tr: 'Geniş sumo squat duruşunda alt noktada yaylanma yapan sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'dumbbell-bicep-curl-press',
    name: {
      en: 'Dumbbell Curl to Press',
      tr: 'Dambıl Biceps Curl ve Omuz Pres',
    },
    category: 'dumbbell',
    muscleGroups: ['arms', 'shoulders', 'core'],
    equipment: ['dumbbells'],
    difficulty: 'beginner',
    defaultWorkSeconds: 35,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Stand tall holding dumbbells at your sides with palms facing forward and elbows tucked near your ribs.',
        'Curl the weights up to shoulder level by contracting your biceps without swinging your torso.',
        'Press the dumbbells overhead, then reverse the movement back to your shoulders and down to your sides.',
      ],
      tr: [
        'Avuç içleri karşıya bakacak ve dirsekler gövdeye yakın olacak şekilde dambıllarla dik durun.',
        'Gövdenizi sallamadan biceps kaslarınızı sıkarak ağırlıkları omuz hizasına kaldırın.',
        'Dambılları baş üstüne itin, ardından hareketi tersine çevirerek omuzlara ve yanlara indirin.',
      ],
    },
    commonMistakes: {
      en: [
        'Swinging the hips and lower back to heave the weights up during the curl.',
        'Dropping the weights down without eccentric control.',
      ],
      tr: [
        'Curl sırasında ağırlıkları kaldırmak için beli ve kalçayı savurmak.',
        'İndiriş aşamasında ağırlıkları kontrolsüzce bırakmak.',
      ],
    },
    easierVariation: {
      en: 'Alternate arms on the curl and press, or use lighter dumbbells.',
      tr: 'Hareketi sağ ve sol kolla sırayla yapın veya daha hafif dambıl kullanın.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/dumbbell-bicep-curl-press.gif',
      posterSrc: 'assets/exercises/dumbbell-bicep-curl-press-poster.png',
      alt: {
        en: 'Athlete curling dumbbells to shoulders and pressing them overhead.',
        tr: 'Dambılları omuzlarına curl yapıp baş üstüne presleyen sporcu illüstrasyonu.',
      },
    },
  },
];

export const EXERCISES_BY_ID: Record<string, Exercise> = Object.fromEntries(
  EXERCISES_CATALOG.map((ex) => [ex.id, ex])
);

export function getExerciseById(id: string): Exercise | undefined {
  return EXERCISES_BY_ID[id];
}
