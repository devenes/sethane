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
  {
    id: 'dumbbell-floor-press',
    name: {
      en: 'Dumbbell Floor Press',
      tr: 'Yerde Dambıl Göğüs Pres',
    },
    category: 'dumbbell',
    muscleGroups: ['chest', 'arms', 'shoulders'],
    equipment: ['dumbbells', 'mat'],
    difficulty: 'beginner',
    defaultWorkSeconds: 40,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Lie flat on your back with knees bent, feet planted firmly on the mat, and dumbbells held above your chest.',
        'Lower your upper arms slowly at a 45-degree angle until the backs of your triceps touch the mat lightly.',
        'Pause briefly without bouncing, then press the dumbbells powerfully back over your chest.',
      ],
      tr: [
        'Dizler bükülü ve ayaklar mata tam basılı şekilde sırtüstü uzanın; dambılları göğüs hizasında yukarıda tutun.',
        'Dirsekleriniz gövdenizle 45 derece açı yapacak şekilde üst kollarınız mata hafifçe değene kadar kontrollüce indirin.',
        'Yerde zıplatmadan kısa bir an duraklayın ve göğüs kaslarınızı sıkarak dambılları tekrar yukarı itin.',
      ],
    },
    commonMistakes: {
      en: [
        'Bouncing the elbows harshly off the floor to generate momentum.',
        'Flaring elbows straight out in line with the shoulders.',
      ],
      tr: [
        'İvme kazanmak için dirsekleri yere sertçe çarptırmak.',
        'Dirsekleri omuz hizasında 90 derece yana açmak.',
      ],
    },
    easierVariation: {
      en: 'Use lighter dumbbells or press one arm at a time for smoother shoulder control.',
      tr: 'Daha hafif dambıl seçin veya omuz kontrolünü artırmak için kolları sırayla itin.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/dumbbell-floor-press.gif',
      posterSrc: 'assets/exercises/dumbbell-floor-press-poster.png',
      alt: {
        en: 'Athlete lying supine on a mat pressing dumbbells vertically above the chest.',
        tr: 'Mat üzerinde sırtüstü uzanarak dambılları göğüs hizasında yukarı presleyen sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'diamond-push-ups',
    name: {
      en: 'Diamond Push-Ups',
      tr: 'Elmas Şınav (Triceps & İç Göğüs)',
    },
    category: 'bodyweight',
    muscleGroups: ['arms', 'chest', 'shoulders', 'core'],
    equipment: ['mat'],
    difficulty: 'intermediate',
    defaultWorkSeconds: 35,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Start in a high plank with hands placed close together directly beneath your sternum.',
        'Brace your abs and glutes while lowering your chest toward your hands, keeping elbows tucked near your ribs.',
        'Drive firmly through your palms to extend your elbows and lock in triceps tension at the top.',
      ],
      tr: [
        'Ellerinizi göğüs kemiğinizin tam altında birbirine yakın konumlandırarak yüksek plank pozisyonu alın.',
        'Dirseklerinizi gövdenize yakın tutarak karın ve kalçayı sıkıp göğsünüzü ellerinize yaklaştırın.',
        'Avuç içlerinizle yeri güçlüce iterek kollarınızı uzatın ve arka kol (triceps) kaslarınızı sıkın.',
      ],
    },
    commonMistakes: {
      en: [
        'Placing the hands too far forward under the face instead of beneath the mid-chest.',
        'Letting the hips sag or elbows splay wide.',
      ],
      tr: [
        'Elleri göğüs altı yerine yüzün altına fazla ileri yerleştirmek.',
        'Kalçayı düşürmek veya dirsekleri dışarı savurmak.',
      ],
    },
    easierVariation: {
      en: 'Perform close-grip push-ups from your knees or with hands elevated on a sturdy bench.',
      tr: 'Dar tutuş şınavı dizler yerde veya eller sağlam bir yükseltide olacak şekilde uygulayın.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/diamond-push-ups.gif',
      posterSrc: 'assets/exercises/diamond-push-ups-poster.png',
      alt: {
        en: 'Athlete performing a close-grip diamond push-up targeting triceps and chest.',
        tr: 'Arka kol ve iç göğsü hedefleyen dar tutuş elmas şınav yapan sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'dumbbell-bent-over-row',
    name: {
      en: 'Dumbbell Bent-Over Row',
      tr: 'Eğilerek Dambıl Sırt Çekiş',
    },
    category: 'dumbbell',
    muscleGroups: ['back', 'arms', 'core'],
    equipment: ['dumbbells'],
    difficulty: 'beginner',
    defaultWorkSeconds: 40,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Stand with feet hip-width apart, hinge your hips back to a 45-degree torso angle, and let dumbbells hang below shoulders.',
        'Keep your spine flat and core braced as you pull both dumbbells toward your lower ribs.',
        'Squeeze your shoulder blades together briefly at the top, then lower the weights slowly.',
      ],
      tr: [
        'Ayaklar kalça genişliğinde açık, kalçayı geriye vererek gövdenizi 45 derece öne eğin; dambıllar omuz altından sarksın.',
        'Sırtınızı düz ve merkez bölgenizi sıkı tutarak dambılları alt kaburgalarınıza doğru çekin.',
        'Üst noktada kürek kemiklerinizi birbirine yaklaştırıp sıkın, ardından kontrollüce indirin.',
      ],
    },
    commonMistakes: {
      en: [
        'Shrugging the shoulders up toward the ears instead of pulling elbows back toward the hips.',
        'Rounding the lumbar spine as fatigue builds.',
      ],
      tr: [
        'Dirsekleri kalçaya doğru çekmek yerine omuzları kulaklara doğru kaldırmak.',
        'Yoruldukça bel ve sırt kavisini bozarak kamburlaşmak.',
      ],
    },
    easierVariation: {
      en: 'Row one arm at a time while bracing the opposite hand on your thigh or a bench.',
      tr: 'Boştaki elinizle dizinizden veya bir sehpadan destek alarak tek kol çekiş yapın.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/dumbbell-bent-over-row.gif',
      posterSrc: 'assets/exercises/dumbbell-bent-over-row-poster.png',
      alt: {
        en: 'Athlete hinged forward rowing dumbbells toward the lower ribs with back engaged.',
        tr: 'Öne eğilmiş pozisyonda dambılları alt kaburgalarına çekerek sırt çalıştıran sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'superman-back-extension',
    name: {
      en: 'Superman Lat Pull',
      tr: 'Yüzüstü Superman Sırt Çekiş',
    },
    category: 'low-impact',
    muscleGroups: ['back', 'glutes', 'shoulders', 'core'],
    equipment: ['mat'],
    difficulty: 'beginner',
    defaultWorkSeconds: 35,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Lie face down on the mat with legs extended and arms reaching overhead.',
        'Gently lift your chest, arms, and thighs a few inches off the mat while squeezing your glutes.',
        'Pull your elbows back into a W-shape to engage your upper back, then extend forward and lower smoothly.',
      ],
      tr: [
        'Bacaklar uzatılmış ve kollar baş ilerisinde olacak şekilde mat üzerine yüzüstü uzanın.',
        'Kalçanızı sıkarak göğsünüzü, kollarınızı ve uyluklarınızı yerden birkaç santimetre kaldırın.',
        'Dirseklerinizi W harfi çizecek şekilde geriye çekip üst sırtınızı sıkın, ardından ileri uzanıp yavaşça inin.',
      ],
    },
    commonMistakes: {
      en: [
        'Cranking the neck upward instead of keeping eyes pointed down toward the mat.',
        'Jerking too high with momentum rather than smooth posterior-chain contraction.',
      ],
      tr: [
        'Bakışları yere dönük nötr tutmak yerine başı sertçe geriye kaldırmak.',
        'Kontrollü sırt kasılması yerine ivmeyle beli aşırı zorlamak.',
      ],
    },
    easierVariation: {
      en: 'Keep your feet resting on the mat and lift only your chest and elbows off the floor.',
      tr: 'Ayaklarınızı matta sabit bırakarak yalnızca göğüs ve kollarınızı hafifçe kaldırıp çekin.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/superman-back-extension.gif',
      posterSrc: 'assets/exercises/superman-back-extension-poster.png',
      alt: {
        en: 'Athlete lying prone lifting chest and legs while pulling elbows back to engage the posterior chain.',
        tr: 'Yüzüstü pozisyonda göğüs ve bacaklarını kaldırıp dirseklerini geriye çekerek arka zinciri çalıştıran sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'dumbbell-lateral-raise',
    name: {
      en: 'Dumbbell Lateral Raise',
      tr: 'Dambıl Yana Açış (Yan Omuz)',
    },
    category: 'dumbbell',
    muscleGroups: ['shoulders', 'core'],
    equipment: ['dumbbells'],
    difficulty: 'beginner',
    defaultWorkSeconds: 35,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Stand tall with feet hip-width apart holding light-to-moderate dumbbells at your sides with a soft bend in the elbows.',
        'Sweep both arms out laterally in a wide arc until your elbows reach shoulder height.',
        'Lower the dumbbells down slowly over 2 seconds without letting tension drop completely.',
      ],
      tr: [
        'Ayaklar kalça genişliğinde açık, dirsekler hafif bükülü şekilde dambılları yanlarınızda tutun.',
        'Omuzlarınızı kulaklarınıza çekmeden kollarınızı yanlara doğru omuz hizasına kadar açın.',
        'Kas gerilimini koruyarak dambılları 2 saniyede kontrollüce başlangıç noktasına indirin.',
      ],
    },
    commonMistakes: {
      en: [
        'Swinging the torso or using hip momentum to heave overly heavy weights upward.',
        'Raising hands high above shoulder level with shrugged upper traps.',
      ],
      tr: [
        'Çok ağır dambıl seçip gövdeyi sallayarak ivmeyle kaldırmak.',
        'Trapez kaslarını sıkarak elleri omuz hizasının çok üzerine çıkarmak.',
      ],
    },
    easierVariation: {
      en: 'Raise one arm at a time (alternating lateral raises) or bend elbows to 90 degrees.',
      tr: 'Sağ ve sol kolu sırayla yana açın veya kaldıraç boyunu kısaltmak için dirsekleri biraz daha bükün.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/dumbbell-lateral-raise.gif',
      posterSrc: 'assets/exercises/dumbbell-lateral-raise-poster.png',
      alt: {
        en: 'Athlete standing upright raising dumbbells out to shoulder level to target medial deltoids.',
        tr: 'Dik duruşta dambılları omuz hizasına yana açarak yan omuz kaslarını çalıştıran sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'dumbbell-tricep-extension',
    name: {
      en: 'Overhead Dumbbell Tricep Extension',
      tr: 'Baş Üstü Dambıl Triceps Ekstansiyon',
    },
    category: 'dumbbell',
    muscleGroups: ['arms', 'shoulders', 'core'],
    equipment: ['dumbbells'],
    difficulty: 'beginner',
    defaultWorkSeconds: 35,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Stand tall with core braced and hold one dumbbell vertically overhead with both hands cupping the top plate.',
        'Keep your upper arms stationary beside your ears as you bend your elbows to lower the weight behind your head.',
        'Extend your forearms smoothly back to full lockout overhead, squeezing your triceps.',
      ],
      tr: [
        'Karın kaslarınızı sıkın ve tek bir dambılı üst plakasından iki elle kavrayarak baş üstünde dikey tutun.',
        'Dirseklerinizi dışa açmadan kulaklarınızın yanında sabit tutarak dambılı başınızın arkasına indirin.',
        'Arka kol (triceps) kaslarınızı sıkarak ön kollarınızı tekrar baş üstünde tam uzatın.',
      ],
    },
    commonMistakes: {
      en: [
        'Arching the lower back instead of keeping ribs stacked over the pelvis.',
        'Letting elbows flare wide out to the sides on every rep.',
      ],
      tr: [
        'Kaburgaları içeride tutmak yerine beli aşırı çukurlaştırmak.',
        'Her tekrarda dirseklerin yanlara doğru açılmasına izin vermek.',
      ],
    },
    easierVariation: {
      en: 'Perform seated on a chair for extra lumbar stability or use a lighter dumbbell.',
      tr: 'Ekstra bel dengesi için sandalyede oturarak uygulayın veya daha hafif dambıl kullanın.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/dumbbell-tricep-extension.gif',
      posterSrc: 'assets/exercises/dumbbell-tricep-extension-poster.png',
      alt: {
        en: 'Athlete extending a dumbbell overhead from behind the head to isolate the triceps.',
        tr: 'Baş arkasından dambılı yukarı uzatarak arka kol kaslarını izole eden sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'lateral-lunges',
    name: {
      en: 'Alternating Lateral Lunges',
      tr: 'Alternatif Yan Lunge (Yan Hamle)',
    },
    category: 'bodyweight',
    muscleGroups: ['legs', 'glutes', 'core'],
    equipment: ['none'],
    difficulty: 'beginner',
    defaultWorkSeconds: 40,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Take a wide stance with toes pointing forward and chest tall.',
        'Shift your hips back and over to the right, bending your right knee deeply while keeping your left leg straight.',
        'Push through your right heel to return to center, then flow smoothly into a left lateral lunge.',
      ],
      tr: [
        'Ayak uçlarınız karşıya bakacak şekilde geniş bir duruş alın ve göğsünüzü dik tutun.',
        'Kalçanızı geriye ve sağa doğru indirerek sağ dizinizi bükün; sol bacağınızı düz ve tabanı yerde tutun.',
        'Sağ topuğunuzdan güç alarak merkeze dönün ve akıcı şekilde sol tarafa yan hamle yapın.',
      ],
    },
    commonMistakes: {
      en: [
        'Letting the heel of the bent leg peel off the floor.',
        'Rounding the chest down instead of sitting the hips backward.',
      ],
      tr: [
        'Bükülen taraftaki topuğun yerden kalkmasına izin vermek.',
        'Kalçayı geriye oturtmak yerine sadece gövdeyi öne eğmek.',
      ],
    },
    easierVariation: {
      en: 'Reduce the lunge depth and keep hands lightly on your thighs for support.',
      tr: 'İniş derinliğini azaltın ve denge için ellerinizden hafifçe destek alın.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/lateral-lunges.gif',
      posterSrc: 'assets/exercises/lateral-lunges-poster.png',
      alt: {
        en: 'Athlete shifting hips side to side in a wide alternating lateral lunge.',
        tr: 'Geniş duruşta kalçasını sağa ve sola indirerek yan hamle yapan sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'dead-bug',
    name: {
      en: 'Dead Bug Core Control',
      tr: 'Dead Bug (Derin Core Stabilizasyon)',
    },
    category: 'core',
    muscleGroups: ['core'],
    equipment: ['mat'],
    difficulty: 'beginner',
    defaultWorkSeconds: 40,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Lie supine on the mat with arms reaching straight toward the ceiling and knees bent at 90 degrees over your hips.',
        'Flatten your lower back against the mat, then slowly extend your right leg forward and left arm overhead.',
        'Return to center with control while exhaling, then repeat with your left leg and right arm.',
      ],
      tr: [
        'Sırtüstü uzanın; kollarınızı tavana dik uzatın ve dizlerinizi kalça üzerinde 90 derece masa pozisyonuna getirin.',
        'Bel boşluğunuzu mata tam bastırarak sağ bacağınızı ileri, sol kolunuzu baş gerisine doğru yavaşça uzatın.',
        'Nefes vererek kontrollüce merkeze dönün ve sol bacak ile sağ kolla tekrarlayın.',
      ],
    },
    commonMistakes: {
      en: [
        'Allowing the lower back to arch off the mat as the leg extends.',
        'Moving both limbs on the same side or rushing without core tension.',
      ],
      tr: [
        'Bacak uzanırken belin mattan kalkıp çukurlaşmasına izin vermek.',
        'Karın kontrolünü bırakıp hareketi çok hızlı savurarak yapmak.',
      ],
    },
    easierVariation: {
      en: 'Keep arms stationary pointing up and tap one bent heel lightly toward the mat at a time.',
      tr: 'Kolları sabit tutun ve diz açısını bozmadan sırayla tek topuğunuzu mata hafifçe dokundurun.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/dead-bug.gif',
      posterSrc: 'assets/exercises/dead-bug-poster.png',
      alt: {
        en: 'Athlete lying supine extending opposite arm and leg with lumbar spine pressed into the mat.',
        tr: 'Sırtüstü pozisyonda belini mata bastırarak çapraz kol ve bacağını uzatan sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'jump-squats',
    name: {
      en: 'Jump Squats',
      tr: 'Sıçramalı Squat (Jump Squat)',
    },
    category: 'cardio',
    muscleGroups: ['legs', 'glutes', 'cardio', 'core'],
    equipment: ['none'],
    difficulty: 'intermediate',
    defaultWorkSeconds: 35,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Stand with feet shoulder-width apart, chest tall, and core braced.',
        'Sit your hips back and down into an athletic squat while loading your arms slightly behind your hips.',
        'Explode upward through the balls of your feet into a vertical jump, swinging arms forward for momentum.',
        'Land softly toe-to-heel with bent knees, absorbing the impact smoothly into the next squat.',
      ],
      tr: [
        'Ayaklar omuz genişliğinde açık, göğüs dik ve merkez bölgesi sıkı şekilde durun.',
        'Kollarınızı hafifçe geriye alarak kalçanızı geriye ve aşağı doğru atletik squat pozisyonuna indirin.',
        'Ayak parmak köklerinizden patlayıcı güç alarak dikey sıçrayın ve kollarınızı yukarı savurun.',
        'Parmak ucundan topuğa yumuşakça ve dizleri bükerek inin; darbeyi emerek bir sonraki tekrara bağlayın.',
      ],
    },
    commonMistakes: {
      en: [
        'Landing stiff-legged with locked knees instead of cushioning into a squat.',
        'Allowing the knees to cave inward on takeoff or landing.',
      ],
      tr: [
        'Yere inerken dizleri büküp darbeyi emmek yerine kilitli dizlerle sert inmek.',
        'Sıçrama veya iniş anında dizlerin birbirine doğru içe çökmesine izin vermek.',
      ],
    },
    easierVariation: {
      en: 'Perform fast bodyweight squats finishing with a high calf raise instead of leaving the floor.',
      tr: 'Yerden sıçramak yerine tempolu squat yapıp üst noktada parmak uçlarında yükselin.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/jump-squats.gif',
      posterSrc: 'assets/exercises/jump-squats-poster.png',
      alt: {
        en: 'Athlete exploding upward from a deep squat into a vertical jump.',
        tr: 'Derin squat pozisyonundan dikey sıçrama yapan sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'dumbbell-swing',
    name: {
      en: 'Dumbbell Hip-Hinge Swing',
      tr: 'Dambıl Kalça Savurma (Swing)',
    },
    category: 'dumbbell',
    muscleGroups: ['full-body', 'glutes', 'back', 'legs', 'cardio'],
    equipment: ['dumbbells'],
    difficulty: 'intermediate',
    defaultWorkSeconds: 40,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Stand with feet slightly wider than shoulder-width, holding one dumbbell vertically with both hands.',
        'Hinge sharply at the hips with a flat back, swinging the dumbbell between your upper thighs.',
        'Snap your hips forward and squeeze your glutes hard to float the dumbbell up to chest height.',
        'Let gravity guide the weight back down into the next hip hinge without rounding your spine.',
      ],
      tr: [
        'Ayaklarınızı omuz genişliğinden biraz açık konumlandırın ve tek dambılı iki elinizle dikey kavrayın.',
        'Sırtınızı düz tutarak kalçadan geriye menteşelenin ve dambılı üst bacaklarınızın arasına doğru salın.',
        'Kalçanızı ileri doğru patlayıcı şekilde kilitleyip sıkarak dambılı göğüs hizasına yükseltin.',
        'Omurga dikliğini bozmadan ağırlığın kontrollüce bacak arasına geri salınmasına izin verin.',
      ],
    },
    commonMistakes: {
      en: [
        'Squatting up and down with the knees instead of hinging horizontally at the hips.',
        'Lifting the dumbbell with the front shoulders instead of driving with hip snap.',
      ],
      tr: [
        'Kalçadan menteşelenmek yerine dizleri fazla bükerek hareketi squata çevirmek.',
        'Ağırlığı kalça itişiyle savurmak yerine sadece omuz ve kollarla kaldırmaya çalışmak.',
      ],
    },
    easierVariation: {
      en: 'Use a lighter dumbbell and limit the swing height to belly-button level.',
      tr: 'Daha hafif bir dambıl seçin ve savurma yüksekliğini karın hizasıyla sınırlandırın.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/dumbbell-swing.gif',
      posterSrc: 'assets/exercises/dumbbell-swing-poster.png',
      alt: {
        en: 'Athlete snapping hips forward to swing a dumbbell to chest height.',
        tr: 'Kalça itişiyle dambılı göğüs hizasına savuran sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'plank-jacks',
    name: {
      en: 'Plank Jacks',
      tr: 'Plank Sıçrayışı (Plank Jack)',
    },
    category: 'cardio',
    muscleGroups: ['core', 'shoulders', 'cardio', 'legs'],
    equipment: ['mat'],
    difficulty: 'intermediate',
    defaultWorkSeconds: 35,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Start in a strong high plank position with wrists stacked under shoulders and feet together.',
        'Brace your abs and glutes so your lower back stays flat and level.',
        'Jump both feet out wide like a horizontal jumping jack, then immediately hop them back together.',
        'Keep your shoulders steady over your wrists while maintaining a brisk, rhythmic foot cadence.',
      ],
      tr: [
        'Bilekler omuzların tam altında ve ayaklar bitişik olacak şekilde yüksek plank pozisyonu alın.',
        'Belinizin çukurlaşmaması için karın ve kalça kaslarınızı sıkıca kilitleyin.',
        'Her iki ayağınızı aynı anda yanlara doğru genişçe sıçratıp hemen tekrar merkeze birleştirin.',
        'Omuzlarınızı bileklerinizin üzerinde sabit tutarak ritmik ve seri bir tempo koruyun.',
      ],
    },
    commonMistakes: {
      en: [
        'Bouncing the hips high in the air on every jump.',
        'Letting the lower back sag toward the floor as the core fatigues.',
      ],
      tr: [
        'Her sıçrayışta kalçayı yukarı doğru zıplatmak.',
        'Merkez bölgesi yoruldukça belin aşağı sarkmasına izin vermek.',
      ],
    },
    easierVariation: {
      en: 'Plank Side Taps: stay in high plank and step one foot out to the side at a time without jumping.',
      tr: 'Sıçramasız Plank Adımı: yüksek plankta kalarak sırayla sağ ve sol ayağınızı yana dokundurup çekin.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/plank-jacks.gif',
      posterSrc: 'assets/exercises/plank-jacks-poster.png',
      alt: {
        en: 'Athlete in high plank jumping both feet wide and back together.',
        tr: 'Yüksek plank pozisyonunda ayaklarını yanlara açıp kapatan sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'dumbbell-snatch',
    name: {
      en: 'Alternating Dumbbell Snatch',
      tr: 'Alternatif Dambıl Koparma (Snatch)',
    },
    category: 'dumbbell',
    muscleGroups: ['full-body', 'back', 'shoulders', 'legs', 'glutes', 'cardio'],
    equipment: ['dumbbells'],
    difficulty: 'advanced',
    defaultWorkSeconds: 35,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Straddle a single dumbbell on the floor with feet wider than shoulder-width and chest proud.',
        'Hinge hips back and grip the dumbbell with one hand while bracing your core.',
        'Drive explosively through your legs and hips, zipping the dumbbell close to your torso and punching it overhead in one fluid motion.',
        'Lower the dumbbell with control to the mid-shin or floor, switch hands, and repeat.',
      ],
      tr: [
        'Ayaklarınızı omuz genişliğinden açık konumlandırın ve dambılı iki ayağınızın ortasına alın.',
        'Sırtınızı düz tutarak kalçayı geriye verin ve dambılı tek elinizle kavrayın.',
        'Bacak ve kalçadan patlayıcı güç alarak dambılı gövdenize yakın bir hatla tek hamlede baş üstüne kilitleyin.',
        'Ağırlığı kontrollüce indirip el değiştirin ve kesintisiz olarak diğer kolla tekrarlayın.',
      ],
    },
    commonMistakes: {
      en: [
        'Swinging the dumbbell out in a wide arc away from the body instead of zipping it vertically.',
        'Rounding the lumbar spine when reaching for the weight at the bottom.',
      ],
      tr: [
        'Dambılı vücuda yakın dikey çekmek yerine önden geniş bir daire çizerek savurmak.',
        'Alt noktada ağırlığa uzanırken beli kamburlaştırmak.',
      ],
    },
    easierVariation: {
      en: 'Perform a hang dumbbell clean-and-press from knee height using a lighter weight.',
      tr: 'Daha hafif bir dambılla diz hizasından omuza alıp baş üstüne pres (Clean & Press) yapın.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/dumbbell-snatch.gif',
      posterSrc: 'assets/exercises/dumbbell-snatch-poster.png',
      alt: {
        en: 'Athlete explosively pulling a single dumbbell from ground to overhead lockout.',
        tr: 'Tek dambılı yerden patlayıcı çekişle baş üstüne kilitleyen sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'pike-push-ups',
    name: {
      en: 'Pike Push-Ups',
      tr: 'Pike Şınav (Omuz ve Üst Göğüs)',
    },
    category: 'bodyweight',
    muscleGroups: ['shoulders', 'chest', 'arms', 'core'],
    equipment: ['mat'],
    difficulty: 'intermediate',
    defaultWorkSeconds: 35,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Begin in a high plank, then walk your feet forward and lift your hips high into an inverted V (pike) position.',
        'Keep your spine straight and gaze toward your feet as you bend your elbows to lower the crown of your head forward and down.',
        'Press firmly through your palms to drive your torso back up to the starting pike position.',
      ],
      tr: [
        'Yüksek plank pozisyonundan ayaklarınızı biraz öne yürütün ve kalçanızı kaldırarak ters V (pike) formu alın.',
        'Dirseklerinizi hafif içe bükerek başınızın tepesini ellerinizin biraz ilerisine doğru kontrollüce yaklaştırın.',
        'Omuz ve üst göğüs kaslarınızı sıkarak avuç içlerinizle yeri itin ve başlangıç pozisyonuna yükselin.',
      ],
    },
    commonMistakes: {
      en: [
        'Dropping the hips down into a regular push-up instead of keeping the inverted V angle.',
        'Lowering the head straight between the hands with flared elbows.',
      ],
      tr: [
        'Kalçayı düşürerek hareketi normal yatay şınava dönüştürmek.',
        'Dirsekleri 90 derece yana açarak başı tam ellerin arasına indirmek.',
      ],
    },
    easierVariation: {
      en: 'Bend your knees slightly to relieve hamstring tension and reduce the depth of the press.',
      tr: 'Arka bacak gerginliğini azaltmak için dizlerinizi hafif bükün ve iniş mesafesini kısaltın.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/pike-push-ups.gif',
      posterSrc: 'assets/exercises/pike-push-ups-poster.png',
      alt: {
        en: 'Athlete in inverted V pike position pressing body weight with shoulders and triceps.',
        tr: 'Ters V pozisyonunda omuz ve arka kol kaslarıyla şınav çeken sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'v-up-crunches',
    name: {
      en: 'Alternating V-Ups',
      tr: 'Alternatif Çakı Mekik (V-Up)',
    },
    category: 'core',
    muscleGroups: ['core'],
    equipment: ['mat'],
    difficulty: 'intermediate',
    defaultWorkSeconds: 35,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Lie supine on the mat with legs extended and arms reaching straight overhead.',
        'Exhale and simultaneously lift your upper torso and one straight leg, reaching both hands toward your shin or toes.',
        'Lower your torso and leg back to the mat under control without letting your lower back arch.',
        'Immediately fold up on the next rep to meet your opposite leg.',
      ],
      tr: [
        'Bacaklarınız uzatılmış ve kollarınız baş gerisinde olacak şekilde mat üzerine sırtüstü uzanın.',
        'Nefes vererek gövdenizi ve düz tuttuğunuz bir bacağınızı aynı anda kaldırıp ellerinizle ayak ucunuza uzanın.',
        'Bel kontrolünü kaybetmeden kontrollüce başlangıç pozisyonuna inin.',
        'Bir sonraki tekrarda diğer bacağınızı kaldırarak dönüşümlü devam edin.',
      ],
    },
    commonMistakes: {
      en: [
        'Throwing the arms forward with momentum while barely lifting the shoulder blades.',
        'Slamming the heels and upper back down onto the mat on the eccentric phase.',
      ],
      tr: [
        'Kürek kemiklerini yerden kaldırmadan sadece kolları savurmak.',
        'İniş aşamasında bacakları ve sırtı kontrolsüzce mata bırakmak.',
      ],
    },
    easierVariation: {
      en: 'Bend your knees to 90 degrees and perform alternating single-knee tuck crunches.',
      tr: 'Dizlerinizi hafif bükerek tek diz çekişli mekik (Tuck Crunch) şeklinde uygulayın.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/v-up-crunches.gif',
      posterSrc: 'assets/exercises/v-up-crunches-poster.png',
      alt: {
        en: 'Athlete folding torso and straight leg upward into a V-shape abdominal crunch.',
        tr: 'Gövde ve bacağını V formunda yukarı katlayarak çakı mekik yapan sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'plank-up-downs',
    name: {
      en: 'Commando Plank Up-Downs',
      tr: 'Komando Plank (Dirsek-El Geçişi)',
    },
    category: 'bodyweight',
    muscleGroups: ['core', 'arms', 'shoulders', 'chest'],
    equipment: ['mat'],
    difficulty: 'intermediate',
    defaultWorkSeconds: 35,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Start in a forearm plank with elbows directly under shoulders and feet set slightly wide for stability.',
        'Brace your core and place your right palm flat on the mat where your right elbow was, then press up with your left hand into a high plank.',
        'Lower your right forearm back to the mat followed by your left forearm to return to a forearm plank.',
        'Alternate the leading arm on every repetition to work both sides evenly.',
      ],
      tr: [
        'Dirsekler omuz altında ve ayaklar denge için biraz açık olacak şekilde ön kol plank pozisyonunda başlayın.',
        'Karın ve kalçanızı sıkarak önce bir elinizi, ardından diğer elinizi mata basıp yüksek şınav (plank) pozisyonuna yükselin.',
        'Aynı sırayla tekrar ön kollarınızın üzerine inerek başlangıç pozisyonuna dönün.',
        'Her tekrarda yukarı itişi başlatan kolunuzu değiştirerek iki tarafı eşit çalıştırın.',
      ],
    },
    commonMistakes: {
      en: [
        'Rocking the hips violently side to side as you transition between forearms and hands.',
        'Placing the hands far forward ahead of the shoulder line.',
      ],
      tr: [
        'Dirsekten ele geçerken kalçayı sağa sola aşırı devirmek.',
        'Elleri omuz hizasının tam altı yerine çok ileriye koymak.',
      ],
    },
    easierVariation: {
      en: 'Perform plank up-downs with your knees resting on the mat while maintaining a straight torso line.',
      tr: 'Omuzdan dize düz hattı koruyarak dizler mat üzerinde destekli şekilde uygulayın.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/plank-up-downs.gif',
      posterSrc: 'assets/exercises/plank-up-downs-poster.png',
      alt: {
        en: 'Athlete transitioning between forearm plank and high hand plank with rigid core.',
        tr: 'Ön kol plank ile yüksek el plank arasında geçiş yapan sporcu illüstrasyonu.',
      },
    },
  },
  {
    id: 'dumbbell-high-pull',
    name: {
      en: 'Dumbbell Sumo High Pull',
      tr: 'Dambıl Sumo Çekiş (High Pull)',
    },
    category: 'dumbbell',
    muscleGroups: ['full-body', 'legs', 'glutes', 'back', 'shoulders', 'cardio'],
    equipment: ['dumbbells'],
    difficulty: 'intermediate',
    defaultWorkSeconds: 35,
    defaultRestSeconds: 15,
    instructions: {
      en: [
        'Take a wide sumo stance with toes turned out 30 to 45 degrees, holding dumbbells vertically between your thighs.',
        'Sit your hips back and down into a deep sumo deadlift while keeping your chest upright.',
        'Drive explosively through your heels and immediately pull the dumbbells up to collarbone height, leading with high elbows.',
        'Lower the weights smoothly back down into the next sumo rep.',
      ],
      tr: [
        'Ayaklarınızı geniş açıp uçlarını 30-45 derece dışa çevirin; dambılları bacaklarınızın önünde tutun.',
        'Göğsünüzü dik tutarak kalçanızı geriye ve aşağı doğru derin sumo deadlift pozisyonuna indirin.',
        'Topuklardan hızla güç alarak doğrulun ve dirseklerinizi yukarı-dışa açarak dambılları köprücük kemiği hizasına çekin.',
        'Ağırlıkları kontrollüce indirerek kesintisiz bir sonraki sumo tekrarına bağlayın.',
      ],
    },
    commonMistakes: {
      en: [
        'Pulling with the arms before the hips and legs finish extending.',
        'Dropping the elbows below the wrists at the top of the pull.',
      ],
      tr: [
        'Bacak ve kalça itişini tamamlamadan ağırlığı sadece kollarla çekmeye başlamak.',
        'Çekişin üst noktasında dirsekleri bileklerin altında tutmak.',
      ],
    },
    easierVariation: {
      en: 'Perform a sumo deadlift to shoulder shrug without pulling the dumbbells up to the chest.',
      tr: 'Dirsek çekişi eklemeden sadece geniş duruş sumo deadlift ve omuz silkme (shrug) yapın.',
    },
    media: {
      type: 'gif',
      src: 'assets/exercises/dumbbell-high-pull.gif',
      posterSrc: 'assets/exercises/dumbbell-high-pull-poster.png',
      alt: {
        en: 'Athlete in wide sumo stance driving up and pulling dumbbells to chest level with high elbows.',
        tr: 'Geniş sumo duruşundan doğrulurken dambılları yüksek dirseklerle göğüs hizasına çeken sporcu illüstrasyonu.',
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
