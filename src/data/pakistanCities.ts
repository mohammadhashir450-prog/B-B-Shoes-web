// Comprehensive list of Pakistan cities
// Major cities shown by default (first 10), rest searchable

export const MAJOR_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
];

const ALL_PAKISTAN_CITIES_RAW: string[] = [
  // Punjab
  'Lahore', 'Faisalabad', 'Rawalpindi', 'Gujranwala', 'Multan', 'Sialkot',
  'Bahawalpur', 'Sargodha', 'Sahiwal', 'Rahim Yar Khan', 'Sheikhupura',
  'Jhang', 'Dera Ghazi Khan', 'Gujrat', 'Kasur', 'Okara', 'Chiniot',
  'Pakpattan', 'Khanewal', 'Hafizabad', 'Muzaffargarh', 'Wah Cantonment',
  'Attock', 'Mianwali', 'Toba Tek Singh', 'Khushab', 'Layyah', 'Vehari',
  'Bhakkar', 'Narowal', 'Chakwal', 'Jhelum', 'Mandi Bahauddin',
  'Nankana Sahib', 'Murree', 'Taxila', 'Daska', 'Kharian', 'Wazirabad',
  'Sambrial', 'Phalia', 'Kamoke', 'Muridke', 'Pattoki', 'Chunian',
  'Kot Addu', 'Lodhran', 'Bahawalnagar', 'Chishtian', 'Hasilpur',
  'Burewala', 'Mailsi', 'Arifwala', 'Renala Khurd', 'Depalpur',
  'Ferozewala', 'Raiwind', 'Shahdara Town',

  // Sindh
  'Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah', 'Mirpur Khas',
  'Jacobabad', 'Shikarpur', 'Khairpur', 'Dadu', 'Badin', 'Thatta',
  'Sanghar', 'Umerkot', 'Tharparkar', 'Naushahro Feroze', 'Ghotki',
  'Tando Allahyar', 'Tando Muhammad Khan', 'Matiari', 'Jamshoro',
  'Kotri', 'Sehwan', 'Kandiaro', 'Kashmore', 'Qambar Shahdadkot',

  // Khyber Pakhtunkhwa
  'Peshawar', 'Mardan', 'Abbottabad', 'Mingora', 'Kohat', 'Dera Ismail Khan',
  'Swabi', 'Nowshera', 'Charsadda', 'Mansehra', 'Haripur', 'Bannu',
  'Karak', 'Lakki Marwat', 'Tank', 'Hangu', 'Buner', 'Chitral',
  'Battagram', 'Malakand', 'Timergara', 'Chakdara', 'Dir', 'Upper Dir',
  'Lower Dir', 'Shangla', 'Kohistan', 'Swat',

  // Balochistan
  'Quetta', 'Turbat', 'Khuzdar', 'Gwadar', 'Hub', 'Chaman', 'Zhob',
  'Dera Murad Jamali', 'Kharan', 'Nushki', 'Mastung', 'Kalat', 'Loralai',
  'Dalbandin', 'Awaran', 'Panjgur', 'Lasbela', 'Uthal', 'Nasirabad',
  'Jaffarabad', 'Sohbatpur', 'Sibi', 'Harnai', 'Ziarat', 'Pishin',
  'Killa Saifullah', 'Killa Abdullah', 'Barkhan', 'Musakhel', 'Sui',
  'Dera Allah Yar',

  // Islamabad Capital Territory
  'Islamabad',

  // Azad Jammu & Kashmir
  'Muzaffarabad', 'Mirpur', 'Rawalakot', 'Bagh', 'Kotli', 'Bhimber',
  'Hajira', 'Plandri', 'Haveli', 'Hattian Bala', 'Neelum',

  // Gilgit-Baltistan
  'Gilgit', 'Skardu', 'Hunza', 'Nagar', 'Ghanche', 'Shigar', 'Astore',
  'Diamer', 'Ghizer',

  // Tribal Districts
  'Bajaur', 'Mohmand', 'Khyber', 'Kurram', 'Orakzai',
  'North Waziristan', 'South Waziristan',
];

// Deduplicated and sorted: major cities first, then the rest alphabetically
const seen = new Set<string>();
const uniqueCities: string[] = [];

MAJOR_CITIES.forEach((city) => {
  if (!seen.has(city)) {
    seen.add(city);
    uniqueCities.push(city);
  }
});

[...ALL_PAKISTAN_CITIES_RAW]
  .sort((a, b) => a.localeCompare(b))
  .forEach((city) => {
    if (!seen.has(city)) {
      seen.add(city);
      uniqueCities.push(city);
    }
  });

export const PAKISTAN_CITIES: string[] = uniqueCities;
