// Sources: University of Sargodha Prospectus 2026 (p. 195) and NBS Orientation, Batch 2026 Fall.
// Where the two differed, the higher designation and the orientation spellings/titles were used.
// To add a photo: put a .jpg in public/people/ and set `photo` to its file name.

export type Rank = "Professor" | "Associate Professor" | "Assistant Professor" | "Lecturer";

export interface FacultyMember {
  name: string;
  rank: Rank;
  qualification?: string;
  role?: string; // extra responsibility, e.g. "CSA, Business"
  photo?: string;
  onLeave?: boolean;
}

export const director = {
  name: "Dr. Arfan Shahzad",
  designation: "Professor / Director",
  qualification: "PhD (foreign)",
  photo: "director.jpeg",
};

export const faculty: FacultyMember[] = [
  { name: "Dr. Hammad Hassan Mirza", rank: "Professor", qualification: "PhD (Finance)", photo: "hammad-hassan-mirza.jpg" },
  { name: "Dr. Haroon Hussain", rank: "Professor", qualification: "PhD (Finance)", photo: "haroon-hussain.jpg" },
  { name: "Dr. Naveed Mushtaq", rank: "Associate Professor", qualification: "PhD", photo: "naveed-mushtaq.jpg" },
  { name: "Dr. Naseer Abbas Khan", rank: "Associate Professor", qualification: "PhD (HRM)", photo: "naseer-abbas-khan.jpg" },
  { name: "Khan Zaman Khan", rank: "Assistant Professor", qualification: "MPhil (Management)", photo: "khan-zaman-khan.jpg" },
  { name: "Dr. Ahmed Saeed", rank: "Assistant Professor", qualification: "PhD (Finance)", role: "CSA, Business", photo: "ahmed-saeed.jpg" },
  { name: "Rafiullah Bilal", rank: "Assistant Professor", qualification: "MPhil (HRM)", photo: "rafiullah-bilal.jpg" },
  { name: "Madiha Riaz", rank: "Assistant Professor", onLeave: true },
  { name: "Dr. Abdul Qayyum", rank: "Assistant Professor", qualification: "PhD (Finance)", photo: "abdul-qayyum.jpg" },
  { name: "Dr. Shahid Mahmood", rank: "Assistant Professor", qualification: "PhD" },
  { name: "Dr. Muhammad Mubashar", rank: "Assistant Professor", qualification: "PhD (Marketing)", photo: "muhammad-mubashar.jpg" },
  { name: "Dr. Tehreem Fatima", rank: "Assistant Professor", qualification: "PhD (HRM)" },
  { name: "Dr. Kamran Iqbal", rank: "Assistant Professor", qualification: "PhD" },
  { name: "Dr. Asad Abbas", rank: "Assistant Professor", qualification: "PhD" },
  { name: "Dr. Matee-ur-Rehman", rank: "Assistant Professor" },
  { name: "Kashif Ammar", rank: "Lecturer", qualification: "MPhil (Management)", photo: "kashif-ammar.jpg" },
  { name: "Faheem Athar Haqqani", rank: "Lecturer", qualification: "MPhil (HRM)", photo: "faheem-athar-haqqani.jpg" },
  { name: "Shahid Mahmood", rank: "Lecturer", qualification: "MPhil (Accounting)", photo: "shahid-mahmood-lecturer.jpg" },
  { name: "Dr. Yasmeen Akhtar", rank: "Lecturer", qualification: "PhD (Finance)", photo: "yasmeen-akhtar.jpg" },
  { name: "Mehwish Rafique", rank: "Lecturer", qualification: "MPhil (Finance)", photo: "mehwish-rafique.jpg" },
  { name: "Zahid Ali Akbar", rank: "Lecturer", qualification: "MPhil (Finance)", photo: "zahid-ali-akbar.jpg" },
  { name: "Muhammad Moin Qadir", rank: "Lecturer", qualification: "MPhil (Marketing)", photo: "moin-qadir.jpg" },
  { name: "Khurram Amin", rank: "Lecturer", qualification: "MPhil (Finance)", photo: "khurram-amin.jpg" },
  { name: "Waqar Ahmed", rank: "Lecturer", qualification: "MPhil (Finance)", role: "CSA, Commerce", photo: "waqar-ahmed.jpg" },
  { name: "Muhammad Ali Mufti", rank: "Lecturer", qualification: "MPhil", role: "Deputy Registrar, MFK-NBS", photo: "ali-mufti.jpg" },
  { name: "Dr. Sadia Shaukat", rank: "Lecturer", qualification: "PhD", role: "Female CSA, Commerce" },
  { name: "Nimra Zia", rank: "Lecturer", qualification: "MPhil (HRM)", photo: "nimra-zia.jpg" },
  { name: "Dr. Muhammad Saqib Nawaz", rank: "Lecturer", qualification: "PhD (Management & Entrepreneurship)", photo: "saqib-nawaz.jpg" },
  { name: "Salman Piracha", rank: "Lecturer", qualification: "MPhil (HRM)", photo: "salman-piracha.jpg" },
  { name: "Dr. Muhammad Haroon Rasheed", rank: "Lecturer" },
  { name: "Dr. Muhammad Manazir", rank: "Lecturer" },
  { name: "Humaira Nadeem", rank: "Lecturer" },
  { name: "Dr. Muhammad Hamid", rank: "Lecturer", qualification: "PhD" },
  { name: "Dr. Abid Bin Shakir", rank: "Lecturer", qualification: "PhD" },
  { name: "Dr. Babar Hameed", rank: "Lecturer", qualification: "PhD" },
  { name: "Dr. Sundus Shahnawaz", rank: "Lecturer", qualification: "PhD" },
  { name: "Shahzad Hassan", rank: "Lecturer" },
  { name: "Dr. Javeria Islam", rank: "Lecturer", qualification: "PhD" },
  { name: "Dr. Salma Mukhtar", rank: "Lecturer", qualification: "PhD" },
  { name: "Dr. Hassan Umar", rank: "Lecturer", qualification: "PhD" },
  { name: "Dr. Sardar Asim Naseer", rank: "Lecturer", qualification: "PhD" },
  { name: "Dr. Ahsan Javaid", rank: "Lecturer", qualification: "PhD" },
  { name: "Faiz Ahmed", rank: "Lecturer" },
  { name: "Dr. Shahid Rasheed", rank: "Lecturer", onLeave: true },
  { name: "Muhammad Zubair Tariq", rank: "Lecturer", onLeave: true },
  { name: "Fahad Najeeb", rank: "Lecturer", onLeave: true },
  { name: "Ali Nawaz", rank: "Lecturer", onLeave: true },
  { name: "M. Mian Ali Noor", rank: "Lecturer", onLeave: true },
  { name: "Muhammad Shahid Iqbal", rank: "Lecturer", onLeave: true },
];

export interface StaffMember {
  name: string;
  role: string;
  photo?: string;
}

export const adminStaff: StaffMember[] = [
  { name: "Muhammad Ali Mufti", role: "Deputy Registrar, MFK-NBS", photo: "ali-mufti.jpg" },
  { name: "Ghulam Muhammad", role: "Assistant Registrar", photo: "ghulam-muhammad.jpg" },
  { name: "Rao Naveed Iqbal", role: "Network & Lab Administrator", photo: "rao-naveed-iqbal.jpg" },
  { name: "Mumtaz Hussain", role: "Assistant / PS to Director", photo: "mumtaz-hussain.jpg" },
  { name: "Muhammad Aftab", role: "DEO, Business Undergraduate Programs", photo: "muhammad-aftab.jpg" },
  { name: "Kamran Gill", role: "DEO, Graduate Programs", photo: "kamran-gill.jpg" },
  { name: "Amjad Ali", role: "Junior Clerk, Commerce Stream", photo: "amjad-ali.jpg" },
  { name: "Usman Shakir", role: "Lab Attendant", photo: "usman-shakir.jpg" },
  { name: "Muhammad Imtiaz", role: "Photocopier", photo: "muhammad-imtiaz.jpg" },
  { name: "Amil Shameel Gujjar", role: "Store Keeper" },
];

export const supportStaff = ["Muhammad Afzal", "Imran Jabar", "Muneer Hussain", "Bahadur", "M. Saleem"];
