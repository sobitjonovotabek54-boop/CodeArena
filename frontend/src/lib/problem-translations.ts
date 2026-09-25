export type ProblemTranslation = {
  title_uz: string;
  description_uz: string;
  input_format_uz?: string;
  output_format_uz?: string;
  constraints_uz?: string;
};

export const PROBLEM_TRANSLATIONS: Record<string, ProblemTranslation> = {
  "two-sum": {
    title_uz: "Ikki son yig'indisi (Two Sum)",
    description_uz:
      "Butun sonlardan iborat `nums` massivi va `target` butun soni berilgan. Yig'indisi `target` ga teng bo'ladigan ikkita sonning indekslarini qaytaring.\n\nHar bir kiritilgan ma'lumotda aynan bitta to'g'ri yechim mavjud deb hisoblang va bir xil elementni ikki marta ishlatish mumkin emas.\n\nIndekslarni o'sish tartibida chop eting.",
    input_format_uz: "Birinchi qator: n target\nIkkinchi qator: n ta butun son (nums)",
    output_format_uz: "Bo'sh joy bilan ajratilgan ikkita indeks",
  },
  "reverse-string": {
    title_uz: "Satrni teskarisiga o'girish (Reverse String)",
    description_uz:
      "Berilgan satrni teskarisiga o'girib chop etuvchi dastur yozing. Kiritish sifatida belgilar ketma-ketligi beriladi.\n\nTeskari o'girilgan satrni chiqaring.",
    input_format_uz: "Bitta qatorda s satri",
    output_format_uz: "Teskari o'girilgan satr",
  },
  fizzbuzz: {
    title_uz: "FizzBuzz",
    description_uz:
      "Berilgan n butun soni uchun, 1 dan n gacha bo'lgan har bir i soni uchun quyidagilarni bajaring:\n- Agar son 3 ga ham, 5 ga ham bo'linsa: \"FizzBuzz\" deb chiqaring\n- Agar faqat 3 ga bo'linsa: \"Fizz\" deb chiqaring\n- Agar faqat 5 ga bo'linsa: \"Buzz\" deb chiqaring\n- Aks holda sonning o'zini (i) chiqaring.\n\nHar bir natijani alohida yangi qatorda chop eting.",
    input_format_uz: "Bitta butun son n",
    output_format_uz: "Har bir qatorda tegishli so'z yoki son",
  },
  "valid-palindrome": {
    title_uz: "To'g'ri palindrom (Valid Palindrome)",
    description_uz:
      "Berilgan s satri palindrom ekanligini aniqlang. Faqat harf va raqamlar hisobga olinadi, katta-kichik harflar bir xil deb qaraladi.\n\nAgar satr palindrom bo'lsa `true`, aks holda `false` deb chiqaring.",
    input_format_uz: "Bitta qatorda s satri",
    output_format_uz: "true yoki false",
  },
  "maximum-of-array": {
    title_uz: "Massivning eng katta elementi (Maximum of Array)",
    description_uz:
      "n ta butun sondan iborat massiv berilgan. Ushbu massivdagi eng katta (maksimal) elementni toping.",
    input_format_uz: "Birinchi qatorda n, ikkinchi qatorda n ta butun son",
    output_format_uz: "Maksimal butun son",
  },
  "binary-search": {
    title_uz: "Ikkilik qidiruv (Binary Search)",
    description_uz:
      "O'sish tartibida saralangan n ta butun sondan iborat massiv va `target` soni berilgan. `target` ning massivdagi 0 dan boshlanuvchi indeksini toping. Agar son topilmasa, -1 chiqaring. Vaqt murakkabligi O(log n) bo'lishi lozim.",
    input_format_uz: "Birinchi qator: n target\nIkkinchi qator: saralangan massiv elementlari",
    output_format_uz: "Topilgan indeks yoki -1",
  },
  factorial: {
    title_uz: "Faktorial (Factorial)",
    description_uz:
      "Berilgan n manfiy bo'lmagan butun sonining faktorialini (n!) hisoblang. 0! = 1 deb hisoblanadi.",
    input_format_uz: "Bitta butun son n",
    output_format_uz: "n ning faktorial qiymati",
  },
  "count-vowels": {
    title_uz: "Unli harflarni sanash (Count Vowels)",
    description_uz:
      "Berilgan satrdagi ingliz tilidagi unli harflar (a, e, i, o, u — katta yoki kichik shaklda) sonini hisoblang.",
    input_format_uz: "Bitta qatorda satr",
    output_format_uz: "Unli harflarning umumiy soni",
  },
  "merge-two-sorted-lists": {
    title_uz: "Ikkita saralangan ro'yxatni birlashtirish (Merge Two Sorted Lists)",
    description_uz:
      "O'sish tartibida saralangan ikkita massiv berilgan. Ularni bitta tartiblangan massivga birlashtiring va natijani bo'sh joy bilan ajratib chiqaring.",
    input_format_uz: "Birinchi qator: n va m (ikkala massiv o'lchami)\nIkkinchi qator: birinchi massiv\nUchinchi qator: ikkinchi massiv",
    output_format_uz: "Birlashtirilgan saralangan elementlar",
  },
  "sum-of-digits": {
    title_uz: "Raqamlar yig'indisi (Sum of Digits)",
    description_uz:
      "Berilgan butun sonning barcha raqamlari yig'indisini hisoblang. Agar son manfiy bo'lsa, manfiy ishora hisobga olinmaydi.",
    input_format_uz: "Bitta butun son",
    output_format_uz: "Raqamlar yig'indisi",
  },
  "longest-substring-without-repeating-characters": {
    title_uz: "Takrorlanmas belgilardan iborat eng uzun qism-satr",
    description_uz:
      "Berilgan s satri ichidan bir xil belgilar takrorlanmagan eng uzun qism-satrning (substring) uzunligini toping.",
    input_format_uz: "Bitta qatorda s satri",
    output_format_uz: "Eng uzun takrorlanmas qism-satr uzunligi",
  },
  "3sum-closest": {
    title_uz: "Eng yaqin 3 ta son yig'indisi (3Sum Closest)",
    description_uz:
      "n ta sondan iborat massiv va `target` soni berilgan. Massivdan yig'indisi `target` ga eng yaqin bo'lgan 3 ta sonni tanlang va ularning yig'indisini qaytaring. Aynan bitta yechim mavjudligi kafolatlanadi.",
    input_format_uz: "Birinchi qator: n target\nIkkinchi qator: n ta son",
    output_format_uz: "Eng yaqin uchlik yig'indisi",
  },
  "sort-colors-dutch-flag": {
    title_uz: "Ranglarni saralash / Golland bayrog'i (Sort Colors)",
    description_uz:
      "Faqat 0 (qizil), 1 (oq) va 2 (ko'k) sonlaridan iborat n ta elementli massiv berilgan. Massivni o'z joyida (in-place) saralang, ya'ni avval barcha 0 lar, keyin 1 lar, so'ngra 2 lar joylashsin.",
    input_format_uz: "Birinchi qator: n\nIkkinchi qator: n ta butun son (0, 1 yoki 2)",
    output_format_uz: "Saralangan massiv elementlari",
  },
  "product-of-array-except-self": {
    title_uz: "O'zidan tashqari elementlar ko'paytmasi (Product of Array Except Self)",
    description_uz:
      "n ta sonli massiv berilgan. Shunday `output` massivini qaytaringki, har bir `output[i]` elementi asl massivdagi `nums[i]` dan boshqa barcha sonlarning ko'paytmasiga teng bo'lsin. Bo'lish (/) amalini ishlatmasdan O(n) vaqtda bajaring.",
    input_format_uz: "Birinchi qator: n\nIkkinchi qator: n ta butun son",
    output_format_uz: "Natijaviy massiv",
  },
  "climbing-stairs": {
    title_uz: "Zinapoyadan ko'tarilish (Climbing Stairs)",
    description_uz:
      "Siz n pog'onali zinapoyaning eng yuqorisiga chiqmoqchisiz. Har safar 1 yoki 2 pog'ona qadam bosishingiz mumkin. Eng yuqoriga chiqishning necha xil unikal usuli borligini hisoblang.",
    input_format_uz: "Bitta butun son n",
    output_format_uz: "Usullar soni",
  },
  "coin-change": {
    title_uz: "Tangalarni maydalash (Coin Change)",
    description_uz:
      "Turli qiymatdagi tangalar to'plami va ma'lum `amount` summasi berilgan. Ushbu summani hosil qilish uchun eng kam nechta tanga kerak bo'lishini toping. Agar bu summani hosil qilish imkonsiz bo'lsa, -1 chiqaring.",
    input_format_uz: "Birinchi qator: tangalar soni va target summa\nIkkinchi qator: tangalar qiymatlari",
    output_format_uz: "Minimal tangalar soni yoki -1",
  },
  "validate-binary-search-tree-values": {
    title_uz: "Ikkilik qidiruv daraxti (BST) tekshiruvi",
    description_uz:
      "Daraxt tugunlari va ularning chap hamda o'ng bolalari berilgan. Ushbu daraxt to'g'ri Ikkilik Qidiruv Daraxti (BST) qoidalariga mos kelishini aniqlang (chapdagi barcha tugunlar ildizdan kichik, o'ngdagilar esa katta bo'lishi shart).",
    input_format_uz: "Daraxt ma'lumotlari ketma-ketligi",
    output_format_uz: "true yoki false",
  },
  "kth-largest-element": {
    title_uz: "k-chi eng katta element (Kth Largest Element)",
    description_uz:
      "Saralanmagan butun sonlar massividan k-chi eng katta elementni toping. E'tibor bering, bu k-chi unikal element emas, balki saralangan tartibdagi k-chi elementdir.",
    input_format_uz: "Birinchi qator: n k\nIkkinchi qator: n ta butun son",
    output_format_uz: "k-chi eng katta element",
  },
  "number-of-islands-grid": {
    title_uz: "Orollar soni (Number of Islands)",
    description_uz:
      "'1' (quruqlik) va '0' (suv) dan iborat m x n o'lchamli to'r berilgan. Orollar sonini hisoblang. Orol gorizontal yoki vertikal tutashgan quruqliklardan iborat bo'lib, uning atrofi butunlay suv bilan o'ralgan deb hisoblanadi.",
    input_format_uz: "Birinchi qator: m n\nKeyingi m ta qatorda: n tadan belgi (0 yoki 1)",
    output_format_uz: "Orollar soni",
  },
  "generate-parentheses": {
    title_uz: "To'g'ri qavslar ketma-ketligi (Generate Parentheses)",
    description_uz:
      "n juft qavslar berilgan. Barcha to'g'ri shakllangan qavslar kombinatsiyalarini hosil qiling va leksikografik tartibda chop eting.",
    input_format_uz: "Bitta butun son n",
    output_format_uz: "Har bir to'g'ri kombinatsiya alohida qatorda",
  },
  "rotate-array": {
    title_uz: "Massivni o'ngga surish (Rotate Array)",
    description_uz:
      "n ta elementdan iborat massiv berilgan. Ushbu massivni k qadam o'ngga suring (siklik ko'chirish).",
    input_format_uz: "Birinchi qator: n k\nIkkinchi qator: massiv elementlari",
    output_format_uz: "Surilgan massiv elementlari",
  },
  "search-in-rotated-sorted-array": {
    title_uz: "Burilgan saralangan massivda qidiruv",
    description_uz:
      "Avval o'sish tartibida saralangan, biroq keyinchalik qaysidir noma'lum nuqtada burilgan (rotated) massiv va `target` soni berilgan. `target` ning indeksini toping. Agar mavjud bo'lmasa, -1 chiqaring. Murakkablik O(log n) bo'lishi lozim.",
    input_format_uz: "Birinchi qator: n target\nIkkinchi qator: massiv elementlari",
    output_format_uz: "Topilgan indeks yoki -1",
  },
  "median-of-two-sorted-arrays": {
    title_uz: "Ikkita saralangan massiv medianasi (Hard)",
    description_uz:
      "O'lchamlari m va n bo'lgan ikkita saralangan `nums1` va `nums2` massivlari berilgan. Ushbu ikkala massivning umumiy medianasini O(log(m+n)) vaqtda toping.",
    input_format_uz: "Birinchi qator: m n\nIkkinchi qator: nums1 elementlari\nUchinchi qator: nums2 elementlari",
    output_format_uz: "Mediana qiymati (masalan, 2.0 yoki 2.5)",
  },
  "n-queens-count": {
    title_uz: "N-Farzinlar masalasi (N-Queens Count)",
    description_uz:
      "n x n o'lchamli shaxmat taxtasiga n ta farzinni bir-biriga hujum qilmaydigan (bir gorizontal, vertikal yoki diagonalda turmaydigan) qilib joylashtirishning nechta turli usuli borligini hisoblang.",
    input_format_uz: "Bitta butun son n",
    output_format_uz: "Yechimlar umumiy soni",
  },
  "word-ladder-length": {
    title_uz: "So'zlar zanjiri uzunligi (Word Ladder Length)",
    description_uz:
      "Boshlang'ich so'z `beginWord`, yakuniy so'z `endWord` va lug'at `wordList` berilgan. Har bir qadamda faqat 1 ta harfni o'zgartirib, har safar lug'atdagi mavjud so'zni hosil qilgan holda, `beginWord` dan `endWord` ga o'tishning eng qisqa zanjir uzunligini toping. Agar o'tish imkonsiz bo'lsa, 0 chiqaring.",
    input_format_uz: "Birinchi qator: beginWord endWord n\nKeyingi qator: lug'atdagi n ta so'z",
    output_format_uz: "Eng qisqa o'tishlar soni",
  },
  "longest-increasing-subsequence": {
    title_uz: "Eng uzun o'suvchi qism-ketma-ketlik (LIS)",
    description_uz:
      "Butun sonlar massividan qat'iy o'suvchi eng uzun qism-ketma-ketlikning (Longest Increasing Subsequence) uzunligini toping.",
    input_format_uz: "Birinchi qator: n\nIkkinchi qator: n ta butun son",
    output_format_uz: "Eng uzun o'suvchi ketma-ketlik uzunligi",
  },
  "trapping-rain-water": {
    title_uz: "Yomg'ir suvini ushlab qolish (Trapping Rain Water)",
    description_uz:
      "Har bir blok kengligi 1 bo'lgan relyef balandliklari berilgan. Yomg'irdan so'ng ushbu relyef oralig'ida to'planib qoladigan suvning umumiy hajmini hisoblang.",
    input_format_uz: "Birinchi qator: n\nIkkinchi qator: n ta manfiy bo'lmagan butun son",
    output_format_uz: "To'plangan suv birliklari soni",
  },
  "edit-distance": {
    title_uz: "Tahrirlash masofasi (Edit Distance / Levenshtein)",
    description_uz:
      "Ikkita so'z `word1` va `word2` berilgan. `word1` ni `word2` ga aylantirish uchun zarur bo'lgan minimal amallar sonini toping. Ruxsat etilgan amallar: bitta harf qo'shish, bitta harfni o'chirish yoki bitta harfni almashtirish.",
    input_format_uz: "Birinchi qatorda word1\nIkkinchi qatorda word2",
    output_format_uz: "Minimal amallar soni",
  },
  "serialize-course-prerequisites-topo": {
    title_uz: "Kurslar ketma-ketligi / Topologik saralash (Course Schedule)",
    description_uz:
      "Jami n ta kurs (0 dan n-1 gacha) va ularning prerekvizitlari (qaysi kursni o'qish uchun avval qaysi birini bitirish kerakligi) berilgan. Barcha kurslarni muvaffaqiyatli yakunlash mumkin bo'lgan to'g'ri o'qish ketma-ketligini toping. Agar sikl mavjud bo'lsa, imkonsizligini ko'rsating.",
    input_format_uz: "Birinchi qator: n m (kurslar va bog'lanishlar soni)\nKeyingi m ta qatorda bog'lanishlar",
    output_format_uz: "Kurslar tartibi",
  },
  "maximum-path-sum-in-triangle": {
    title_uz: "Uchburchak bo'yicha maksimal yo'l yig'indisi",
    description_uz:
      "Sonlardan iborat uchburchak berilgan. Eng yuqori cho'qqidan pastga qarab harakatlanib, qo'shni elementlar orqali o'tuvchi eng katta yig'indiga ega yo'lni toping.",
    input_format_uz: "Birinchi qator: qatorlar soni n\nKeyingi qatorlarda uchburchak elementlari",
    output_format_uz: "Maksimal yo'l yig'indisi",
  },
};

export function getProblemTitle(
  problem: { slug: string; title: string },
  lang: "uz" | "en"
): string {
  if (lang === "uz" && PROBLEM_TRANSLATIONS[problem.slug]?.title_uz) {
    return PROBLEM_TRANSLATIONS[problem.slug].title_uz;
  }
  return problem.title;
}

export function getProblemDescription(
  problem: { slug: string; description?: string },
  lang: "uz" | "en"
): string {
  if (lang === "uz" && PROBLEM_TRANSLATIONS[problem.slug]?.description_uz) {
    return PROBLEM_TRANSLATIONS[problem.slug].description_uz;
  }
  return problem.description || "";
}

export function getProblemInputFormat(
  problem: { slug: string; input_format?: string },
  lang: "uz" | "en"
): string {
  if (lang === "uz" && PROBLEM_TRANSLATIONS[problem.slug]?.input_format_uz) {
    return PROBLEM_TRANSLATIONS[problem.slug].input_format_uz ?? "";
  }
  return problem.input_format || "";
}

export function getProblemOutputFormat(
  problem: { slug: string; output_format?: string },
  lang: "uz" | "en"
): string {
  if (lang === "uz" && PROBLEM_TRANSLATIONS[problem.slug]?.output_format_uz) {
    return PROBLEM_TRANSLATIONS[problem.slug].output_format_uz ?? "";
  }
  return problem.output_format || "";
}

