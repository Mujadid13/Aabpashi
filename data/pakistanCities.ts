const countries = [
  {
    "value": "PK",
    "label": {
      "en": "Pakistan",
      "ur": "پاکستان"
    },
    "cities": [
      {
        "value": "Karachi",
        "label": {
          "en": "Karachi",
          "ur": "کراچی"
        }
      },
      {
        "value": "Lahore",
        "label": {
          "en": "Lahore",
          "ur": "لاہور"
        }
      },
      {
        "value": "Sialkot",
        "label": {
          "en": "Sialkot",
          "ur": "سیالکوٹ"
        }
      },
      {
        "value": "Faisalabad",
        "label": {
          "en": "Faisalabad",
          "ur": "فیصل آباد"
        }
      },
      {
        "value": "Rawalpindi",
        "label": {
          "en": "Rawalpindi",
          "ur": "راولپنڈی"
        }
      },
      {
        "value": "Peshawar",
        "label": {
          "en": "Peshawar",
          "ur": "پشاور"
        }
      },
      {
        "value": "Saidu Sharif",
        "label": {
          "en": "Saidu Sharif",
          "ur": "سیدو شریف"
        }
      },
      {
        "value": "Multan",
        "label": {
          "en": "Multan",
          "ur": "ملتان"
        }
      },
      {
        "value": "Gujranwala",
        "label": {
          "en": "Gujranwala",
          "ur": "گوجرانوالہ"
        }
      },
      {
        "value": "Islamabad",
        "label": {
          "en": "Islamabad",
          "ur": "اسلام آباد"
        }
      },
      {
        "value": "Quetta",
        "label": {
          "en": "Quetta",
          "ur": "کوئٹہ"
        }
      },
      {
        "value": "Bahawalpur",
        "label": {
          "en": "Bahawalpur",
          "ur": "بہاولپور"
        }
      },
      {
        "value": "Sargodha",
        "label": {
          "en": "Sargodha",
          "ur": "سرگودھا"
        }
      },
      {
        "value": "New Mirpur",
        "label": {
          "en": "New Mirpur",
          "ur": "نیو میرپور"
        }
      },
      {
        "value": "Chiniot",
        "label": {
          "en": "Chiniot",
          "ur": "چنیوٹ"
        }
      },
      {
        "value": "Sukkur",
        "label": {
          "en": "Sukkur",
          "ur": "سکھر"
        }
      },
      {
        "value": "Larkana",
        "label": {
          "en": "Larkana",
          "ur": "لاڑکانہ"
        }
      },
      {
        "value": "Shekhupura",
        "label": {
          "en": "Shekhupura",
          "ur": "شیخوپورہ"
        }
      },
      {
        "value": "Jhang City",
        "label": {
          "en": "Jhang City",
          "ur": "جھنگ"
        }
      },
      {
        "value": "Rahimyar Khan",
        "label": {
          "en": "Rahimyar Khan",
          "ur": "رحیم یار خان"
        }
      },
      {
        "value": "Gujrat",
        "label": {
          "en": "Gujrat",
          "ur": "گجرات"
        }
      },
      {
        "value": "Kasur",
        "label": {
          "en": "Kasur",
          "ur": "قصور"
        }
      },
      {
        "value": "Mardan",
        "label": {
          "en": "Mardan",
          "ur": "مردان"
        }
      },
      {
        "value": "Mingaora",
        "label": {
          "en": "Mingaora",
          "ur": "مینگورہ"
        }
      },
      {
        "value": "Dera Ghazi Khan",
        "label": {
          "en": "Dera Ghazi Khan",
          "ur": "ڈیرہ غازی خان"
        }
      },
      {
        "value": "Nawabshah",
        "label": {
          "en": "Nawabshah",
          "ur": "نوابشاہ"
        }
      },
      {
        "value": "Sahiwal",
        "label": {
          "en": "Sahiwal",
          "ur": "ساہیوال"
        }
      },
      {
        "value": "Mirpur Khas",
        "label": {
          "en": "Mirpur Khas",
          "ur": "میرپور خاص"
        }
      },
      {
        "value": "Okara",
        "label": {
          "en": "Okara",
          "ur": "اوکاڑہ"
        }
      },
      {
        "value": "Mandi Burewala",
        "label": {
          "en": "Mandi Burewala",
          "ur": "بورے والا"
        }
      },
      {
        "value": "Jacobabad",
        "label": {
          "en": "Jacobabad",
          "ur": "جیکب آباد"
        }
      },
      {
        "value": "Saddiqabad",
        "label": {
          "en": "Saddiqabad",
          "ur": "صدیق آباد"
        }
      },
      {
        "value": "Kohat",
        "label": {
          "en": "Kohat",
          "ur": "کوہاٹ"
        }
      },
      {
        "value": "Muridke",
        "label": {
          "en": "Muridke",
          "ur": "مریدکے"
        }
      },
      {
        "value": "Muzaffargarh",
        "label": {
          "en": "Muzaffargarh",
          "ur": "مظفرگڑھ"
        }
      },
      {
        "value": "Khanpur",
        "label": {
          "en": "Khanpur",
          "ur": "خانپور"
        }
      },
      {
        "value": "Gojra",
        "label": {
          "en": "Gojra",
          "ur": "گوجرہ"
        }
      },
      {
        "value": "Mandi Bahauddin",
        "label": {
          "en": "Mandi Bahauddin",
          "ur": "منڈی بہاؤالدین"
        }
      },
      {
        "value": "Abbottabad",
        "label": {
          "en": "Abbottabad",
          "ur": "ایبٹ آباد"
        }
      },
      {
        "value": "Dadu",
        "label": {
          "en": "Dadu",
          "ur": "دادو"
        }
      },
      {
        "value": "Khuzdar",
        "label": {
          "en": "Khuzdar",
          "ur": "خضدار"
        }
      },
      {
        "value": "Pakpattan",
        "label": {
          "en": "Pakpattan",
          "ur": "پاکپتن"
        }
      },
      {
        "value": "Tando Allahyar",
        "label": {
          "en": "Tando Allahyar",
          "ur": "ٹنڈو الہ یار"
        }
      },
      {
        "value": "Vihari",
        "label": {
          "en": "Vihari",
          "ur": "وہاڑی"
        }
      },
      {
        "value": "Jaranwala",
        "label": {
          "en": "Jaranwala",
          "ur": "جڑانوالہ"
        }
      },
      {
        "value": "Kamalia",
        "label": {
          "en": "Kamalia",
          "ur": "کمالیہ"
        }
      },
      {
        "value": "Kot Addu",
        "label": {
          "en": "Kot Addu",
          "ur": "کوٹ ادو"
        }
      },
      {
        "value": "Nowshera",
        "label": {
          "en": "Nowshera",
          "ur": "نوشہرہ"
        }
      },
      {
        "value": "Swabi",
        "label": {
          "en": "Swabi",
          "ur": "صوابی"
        }
      },
      {
        "value": "Dera Ismail Khan",
        "label": {
          "en": "Dera Ismail Khan",
          "ur": "ڈیرہ اسماعیل خان"
        }
      },
      {
        "value": "Chaman",
        "label": {
          "en": "Chaman",
          "ur": "چمن"
        }
      },
      {
        "value": "Charsadda",
        "label": {
          "en": "Charsadda",
          "ur": "چارسدہ"
        }
      },
      {
        "value": "Kandhkot",
        "label": {
          "en": "Kandhkot",
          "ur": "کندھ کوٹ"
        }
      },
      {
        "value": "Hasilpur",
        "label": {
          "en": "Hasilpur",
          "ur": "حاصل پور"
        }
      },
      {
        "value": "Muzaffarabad",
        "label": {
          "en": "Muzaffarabad",
          "ur": "مظفر آباد"
        }
      },
      {
        "value": "Mianwali",
        "label": {
          "en": "Mianwali",
          "ur": "میانوالی"
        }
      },
      {
        "value": "Jalalpur Jattan",
        "label": {
          "en": "Jalalpur Jattan",
          "ur": "جلالپور جٹاں"
        }
      },
      {
        "value": "Bhakkar",
        "label": {
          "en": "Bhakkar",
          "ur": "بھکر"
        }
      },
      {
        "value": "Zhob",
        "label": {
          "en": "Zhob",
          "ur": "ژوب"
        }
      },
      {
        "value": "Kharian",
        "label": {
          "en": "Kharian",
          "ur": "کھاریاں"
        }
      },
      {
        "value": "Mian Channun",
        "label": {
          "en": "Mian Channun",
          "ur": "میاں چنوں"
        }
      },
      {
        "value": "Jamshoro",
        "label": {
          "en": "Jamshoro",
          "ur": "جامشورو"
        }
      },
      {
        "value": "Pattoki",
        "label": {
          "en": "Pattoki",
          "ur": "پتوکی"
        }
      },
      {
        "value": "Harunabad",
        "label": {
          "en": "Harunabad",
          "ur": "ہارون آباد"
        }
      },
      {
        "value": "Toba Tek Singh",
        "label": {
          "en": "Toba Tek Singh",
          "ur": "ٹوبہ ٹیک سنگھ"
        }
      },
      {
        "value": "Shakargarh",
        "label": {
          "en": "Shakargarh",
          "ur": "شکرگڑھ"
        }
      },
      {
        "value": "Hujra Shah Muqim",
        "label": {
          "en": "Hujra Shah Muqim",
          "ur": "حجرہ شاہ مقیم"
        }
      },
      {
        "value": "Kabirwala",
        "label": {
          "en": "Kabirwala",
          "ur": "کبیروالا"
        }
      },
      {
        "value": "Mansehra",
        "label": {
          "en": "Mansehra",
          "ur": "مانسہرہ"
        }
      },
      {
        "value": "Lala Musa",
        "label": {
          "en": "Lala Musa",
          "ur": "لالہ موسیٰ"
        }
      },
      {
        "value": "Nankana Sahib",
        "label": {
          "en": "Nankana Sahib",
          "ur": "ننکانہ صاحب"
        }
      },
      {
        "value": "Bannu",
        "label": {
          "en": "Bannu",
          "ur": "بنوں"
        }
      },
      {
        "value": "Timargara",
        "label": {
          "en": "Timargara",
          "ur": "تیمرگرہ"
        }
      },
      {
        "value": "Parachinar",
        "label": {
          "en": "Parachinar",
          "ur": "پاراچنار"
        }
      },
      {
        "value": "Gwadar",
        "label": {
          "en": "Gwadar",
          "ur": "گوادر"
        }
      },
      {
        "value": "Abdul Hakim",
        "label": {
          "en": "Abdul Hakim",
          "ur": "عبدالحکیم"
        }
      },
      {
        "value": "Hassan Abdal",
        "label": {
          "en": "Hassan Abdal",
          "ur": "حسن ابدال"
        }
      },
      {
        "value": "Tank",
        "label": {
          "en": "Tank",
          "ur": "ٹانک"
        }
      },
      {
        "value": "Hangu",
        "label": {
          "en": "Hangu",
          "ur": "ہنگو"
        }
      },
      {
        "value": "Risalpur Cantonment",
        "label": {
          "en": "Risalpur Cantonment",
          "ur": "رسالپور چھاؤنی"
        }
      },
      {
        "value": "Karak",
        "label": {
          "en": "Karak",
          "ur": "کرک"
        }
      },
      {
        "value": "Kundian",
        "label": {
          "en": "Kundian",
          "ur": "کنڈیان"
        }
      },
      {
        "value": "Umarkot",
        "label": {
          "en": "Umarkot",
          "ur": "عمرکوٹ"
        }
      },
      {
        "value": "Chitral",
        "label": {
          "en": "Chitral",
          "ur": "چترال"
        }
      },
      {
        "value": "Dainyor",
        "label": {
          "en": "Dainyor",
          "ur": "دنیور"
        }
      },
      {
        "value": "Kulachi",
        "label": {
          "en": "Kulachi",
          "ur": "کلاچی"
        }
      },
      {
        "value": "Kotli",
        "label": {
          "en": "Kotli",
          "ur": "کوٹلی"
        }
      },
      {
        "value": "Gilgit",
        "label": {
          "en": "Gilgit",
          "ur": "گلگت"
        }
      },
      {
        "value": "Hyderabad City",
        "label": {
          "en": "Hyderabad City",
          "ur": "حیدرآباد"
        }
      },
      {
        "value": "Narowal",
        "label": {
          "en": "Narowal",
          "ur": "نارووال"
        }
      },
      {
        "value": "Khairpur Mir’s",
        "label": {
          "en": "Khairpur Mir’s",
          "ur": "خیرپور"
        }
      },
      {
        "value": "Khanewal",
        "label": {
          "en": "Khanewal",
          "ur": "خانیوال"
        }
      },
      {
        "value": "Jhelum",
        "label": {
          "en": "Jhelum",
          "ur": "جہلم"
        }
      },
      {
        "value": "Haripur",
        "label": {
          "en": "Haripur",
          "ur": "ہری پور"
        }
      },
      {
        "value": "Shikarpur",
        "label": {
          "en": "Shikarpur",
          "ur": "شکارپور"
        }
      },
      {
        "value": "Rawala Kot",
        "label": {
          "en": "Rawala Kot",
          "ur": "راولا کوٹ"
        }
      },
      {
        "value": "Hafizabad",
        "label": {
          "en": "Hafizabad",
          "ur": "حافظ آباد"
        }
      },
      {
        "value": "Lodhran",
        "label": {
          "en": "Lodhran",
          "ur": "لودھراں"
        }
      },
      {
        "value": "Malakand",
        "label": {
          "en": "Malakand",
          "ur": "مالاکنڈ"
        }
      },
      {
        "value": "Attock City",
        "label": {
          "en": "Attock City",
          "ur": "اٹک"
        }
      },
      {
        "value": "Batgram",
        "label": {
          "en": "Batgram",
          "ur": "بٹگرام"
        }
      },
      {
        "value": "Matiari",
        "label": {
          "en": "Matiari",
          "ur": "مٹیاری"
        }
      },
      {
        "value": "Ghotki",
        "label": {
          "en": "Ghotki",
          "ur": "گھوٹکی"
        }
      },
      {
        "value": "Naushahro Firoz",
        "label": {
          "en": "Naushahro Firoz",
          "ur": "نوشہرو فیروز"
        }
      },
      {
        "value": "Alpurai",
        "label": {
          "en": "Alpurai",
          "ur": "الپوری"
        }
      },
      {
        "value": "Bagh",
        "label": {
          "en": "Bagh",
          "ur": "باغ"
        }
      },
      {
        "value": "Daggar",
        "label": {
          "en": "Daggar",
          "ur": "دگار"
        }
      },
      {
        "value": "Bahawalnagar",
        "label": {
          "en": "Bahawalnagar",
          "ur": "بہاولنگر"
        }
      },
      {
        "value": "Leiah",
        "label": {
          "en": "Leiah",
          "ur": "لیہ"
        }
      },
      {
        "value": "Tando Muhammad Khan",
        "label": {
          "en": "Tando Muhammad Khan",
          "ur": "ٹنڈو محمد خان"
        }
      },
      {
        "value": "Chakwal",
        "label": {
          "en": "Chakwal",
          "ur": "چکوال"
        }
      },
      {
        "value": "Khushab",
        "label": {
          "en": "Khushab",
          "ur": "خوشاب"
        }
      },
      {
        "value": "Badin",
        "label": {
          "en": "Badin",
          "ur": "بدین"
        }
      },
      {
        "value": "Lakki",
        "label": {
          "en": "Lakki",
          "ur": "لکی مروت"
        }
      },
      {
        "value": "Rajanpur",
        "label": {
          "en": "Rajanpur",
          "ur": "راجن پور"
        }
      },
      {
        "value": "Dera Allahyar",
        "label": {
          "en": "Dera Allahyar",
          "ur": "ڈیرہ اللہ یار"
        }
      },
      {
        "value": "Shahdad Kot",
        "label": {
          "en": "Shahdad Kot",
          "ur": "شہداد کوٹ"
        }
      },
      {
        "value": "Pishin",
        "label": {
          "en": "Pishin",
          "ur": "پشین"
        }
      },
      {
        "value": "Sanghar",
        "label": {
          "en": "Sanghar",
          "ur": "سانگھڑ"
        }
      },
      {
        "value": "Upper Dir",
        "label": {
          "en": "Upper Dir",
          "ur": "اپر دیر"
        }
      },
      {
        "value": "Thatta",
        "label": {
          "en": "Thatta",
          "ur": "ٹھٹھہ"
        }
      },
      {
        "value": "Dera Murad Jamali",
        "label": {
          "en": "Dera Murad Jamali",
          "ur": "ڈیرہ مراد جمالی"
        }
      },
      {
        "value": "Kohlu",
        "label": {
          "en": "Kohlu",
          "ur": "کوہلو"
        }
      },
      {
        "value": "Mastung",
        "label": {
          "en": "Mastung",
          "ur": "مستونگ"
        }
      },
      {
        "value": "Dasu",
        "label": {
          "en": "Dasu",
          "ur": "داسو"
        }
      },
      {
        "value": "Athmuqam",
        "label": {
          "en": "Athmuqam",
          "ur": "آٹھمقام"
        }
      },
      {
        "value": "Loralai",
        "label": {
          "en": "Loralai",
          "ur": "لورالائی"
        }
      },
      {
        "value": "Barkhan",
        "label": {
          "en": "Barkhan",
          "ur": "برکھان"
        }
      },
      {
        "value": "Musa Khel Bazar",
        "label": {
          "en": "Musa Khel Bazar",
          "ur": "موسی خیل بازار"
        }
      },
      {
        "value": "Ziarat",
        "label": {
          "en": "Ziarat",
          "ur": "زیارت"
        }
      },
      {
        "value": "Gandava",
        "label": {
          "en": "Gandava",
          "ur": "گنداواہ"
        }
      },
      {
        "value": "Sibi",
        "label": {
          "en": "Sibi",
          "ur": "سبی"
        }
      },
      {
        "value": "Dera Bugti",
        "label": {
          "en": "Dera Bugti",
          "ur": "ڈیرہ بگٹی"
        }
      },
      {
        "value": "Eidgah",
        "label": {
          "en": "Eidgah",
          "ur": "عیدگاہ"
        }
      },
      {
        "value": "Turbat",
        "label": {
          "en": "Turbat",
          "ur": "تربت"
        }
      },
      {
        "value": "Uthal",
        "label": {
          "en": "Uthal",
          "ur": "اوتھل"
        }
      },
      {
        "value": "Chilas",
        "label": {
          "en": "Chilas",
          "ur": "چلاس"
        }
      },
      {
        "value": "Kalat",
        "label": {
          "en": "Kalat",
          "ur": "قلات"
        }
      },
      {
        "value": "Panjgur",
        "label": {
          "en": "Panjgur",
          "ur": "پنجگور"
        }
      },
      {
        "value": "Gakuch",
        "label": {
          "en": "Gakuch",
          "ur": "گاکچ"
        }
      },
      {
        "value": "Qila Saifullah",
        "label": {
          "en": "Qila Saifullah",
          "ur": "قلعہ سیف اللہ"
        }
      },
      {
        "value": "Kharan",
        "label": {
          "en": "Kharan",
          "ur": "خاران"
        }
      },
      {
        "value": "Aliabad",
        "label": {
          "en": "Aliabad",
          "ur": "علی آباد"
        }
      },
      {
        "value": "Awaran",
        "label": {
          "en": "Awaran",
          "ur": "آواران"
        }
      },
      {
        "value": "Dalbandin",
        "label": {
          "en": "Dalbandin",
          "ur": "دالبندین"
        }
      }
    ]
  }
];

export default countries;