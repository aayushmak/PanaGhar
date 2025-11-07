require("dotenv").config();
const mongoose = require("mongoose");
const Book = require("./models/Book"); // adjust path if needed

const dbURI = process.env.MONGODB_URI_ATLAS || process.env.MONGODB_URI_LOCAL;

const books = [
  {
    bookName: "Where There Be Monsters",
    author: "Alby C. Williams",
    rating: 3.97,
    genre: "Children",
    condition: "Good",
    description:
      "Where There Be Monsters is a thrilling debut middle-grade fantasy about eleven-year-old Glory Brown...",
    imageUrls: ["/uploads/where-there-be-monsters.jpg"]
  },
  {
    bookName: "Creaky Acres: A Graphic Novel",
    author: "Nilah Magruder",
    rating: 4.31,
    genre: "Children",
    condition: "Good",
    description:
      "Creaky Acres is a heartening graphic novel that explores change, friendship, and belonging...",
    imageUrls: ["/uploads/creaky-acres.jpg"]
  },
  {
    bookName: "The Gate, the Girl, and the Dragon",
    author: "Grace Lin",
    rating: 4.38,
    genre: "Children",
    condition: "Excellent",
    description:
      "Grace Lin’s richly illustrated tale follows Jin, a bored Stone Lion guardian who accidentally knocks a relic into the human world...",
    imageUrls: ["/uploads/gate-girl-dragon.jpg"]
  },
  {
    bookName: "Lu and Ren’s Guide to Geozoology",
    author: "Angela Hsieh",
    rating: 4.37,
    genre: "Children",
    condition: "Good",
    description:
      "Lu and Ren’s Guide to Geozoology blends fantasy, science, and adventure as Lu searches for her missing Ah-ma...",
    imageUrls: ["/uploads/lu-ren-geozoology.jpg"]
  },
  {
    bookName: "One Crazy Summer: The Graphic Novel",
    author: "Rita Williams-Garcia, illustrated by Sharee Miller",
    rating: 4.14,
    genre: "Children",
    condition: "Excellent",
    description:
      "One Crazy Summer: The Graphic Novel brings Rita Williams-Garcia’s award-winning story to vivid life...",
    imageUrls: ["/uploads/one-crazy-summer.jpg"]
  },
  {
    bookName: "Going Overboard",
    author: "Caroline Huntoon",
    rating: 4.04,
    genre: "Children",
    condition: "Good",
    description:
      "Going Overboard is a middle-grade romp full of heart, humor, and hijinks as Piper, a nonbinary tween...",
    imageUrls: ["/uploads/going-overboard.jpg"]
  },
  // =================== FICTION ===================
  {
    bookName: "My Friends",
    author: "Fredrik Backman, translated by Neil Smith",
    rating: 4.52,
    genre: "Fiction",
    condition: "Excellent",
    description:
      "In My Friends, Fredrik Backman delivers a deeply moving and artfully layered story about the transformative power of friendship and art. As Louisa, a soon-to-be eighteen-year-old aspiring artist, investigates the mystery behind a famous painting’s background figures, she uncovers the past of a group of teenagers who once found solace and freedom on a remote pier. Blending past and present, the novel explores how connection can shape identity and purpose, and how art can carry untold stories across generations.",
    imageUrls: ["/uploads/my-friends.jpg"],
  },
  {
    bookName: "The Names",
    author: "Florence Knapp",
    rating: 4.18,
    genre: "Fiction",
    condition: "Good",
    description:
      "The Names by Florence Knapp is a powerful and imaginative novel that asks whether a single choice can change a life’s entire course. When Cora hesitates to name her newborn son after her controlling husband, the story splits into three alternate timelines, each shaped by her decision. Spanning decades, the novel examines the aftermath of domestic abuse, the struggle for autonomy, and the enduring bonds of family.",
    imageUrls: ["uploads/the-names.jpg"],
  },
  {
    bookName: "The Emperor of Gladness",
    author: "Ocean Vuong",
    rating: 4.12,
    genre: "Fiction",
    condition: "Excellent",
    description:
      "In The Emperor of Gladness, Ocean Vuong returns with a lyrical and heart-shattering novel about unexpected friendship, chosen family, and the healing power of love. When Hai, a nineteen-year-old at the brink of despair, meets Grazina, an elderly widow with dementia, an unlikely companionship forms, altering the course of their lives.",
    imageUrls: ["/uploads/the-emperor-of-gladness.jpg"],
  },
  {
    bookName: "Never Flinch",
    author: "Stephen King",
    rating: 3.95,
    genre: "Fiction",
    condition: "Good",
    description:
      "Never Flinch is a gripping thriller from Stephen King, weaving two converging storylines into one explosive narrative. Detective Izzy Jaynes and investigator Holly Gibney must stop a calculated murder spree, while feminist activist Kate McKay is being stalked. A chilling exploration of vengeance, belief, and the darkness hiding in plain sight.",
    imageUrls: ["/uploads/never-flinch.jpg"],
  },
  {
    bookName: "Aftertaste",
    author: "Daria Lavelle",
    rating: 4.05,
    genre: "Fiction",
    condition: "Excellent",
    description:
      "Aftertaste by Daria Lavelle tells the story of Konstantin Duhovny, a man who can taste the favorite meals of the dead. Using his gift to help the grieving, he becomes entangled in the chaotic world of New York’s culinary elite and the emotional reckoning that follows.",
    imageUrls: ["/uploads/aftertaste.jpg"],
  },
  {
    bookName: "The Original Daughter",
    author: "Jemimah Wei",
    rating: 3.76,
    genre: "Fiction",
    condition: "Average",
    description:
      "The Original Daughter by Jemimah Wei is a searing debut that dissects ambition, family, and identity in Singapore. When Genevieve’s life is upended by her half-sister’s arrival, betrayal drives them apart, forcing her to question what truly matters—loyalty or self-preservation.",
    imageUrls: ["/uploads/the-original-daughter.jpg"],
  },

  // =================== HISTORY ===================
  {
    bookName: "Marsha: The Joy and Defiance of Marsha P. Johnson",
    author: "Tourmaline",
    rating: 4.44,
    genre: "History",
    condition: "Good",
    description:
      "Marsha: The Joy and Defiance of Marsha P. Johnson is a definitive biography of the Black transgender activist whose legacy shaped the LGBTQIA+ movement. Tourmaline captures Marsha's resilience, activism, and revolutionary spirit.",
    imageUrls: ["/uploads/marsha.jpg"],
  },
  {
    bookName: "Dianaworld: An Obsession",
    author: "Edward White",
    rating: 3.41,
    genre: "History",
    condition: "Good",
    description:
      "Dianaworld explores the myth and reality of Princess Diana’s life and cultural legacy. Edward White offers a multifaceted portrait of the princess and her ongoing impact on global imagination.",
    imageUrls: ["/uploads/dianaworld.jpg"],
  },
  {
    bookName: "Little Bosses Everywhere: How the Pyramid Scheme Shaped America",
    author: "Bridget Read",
    rating: 4.13,
    genre: "History",
    condition: "Average",
    description:
      "Bridget Read uncovers how multilevel marketing shaped American capitalism and politics, revealing the social and financial costs of this deceptive business model.",
    imageUrls: ["/uploads/little-bosses-everywhere.jpg"],
  },
  {
    bookName: "Foreign Fruit: A Personal History of the Orange",
    author: "Katie Goh",
    rating: 3.77,
    genre: "History",
    condition: "Bad",
    description:
      "Katie Goh explores the global and personal history of the orange, using the fruit as a symbol of cultural identity and belonging in a moving blend of memoir and history.",
    imageUrls: ["/uploads/foreign-fruit.jpg"],
  },
  {
    bookName: "1861: The Lost Peace",
    author: "Jay Winik",
    rating: 4.11,
    genre: "History",
    condition: "Excellent",
    description:
      "Jay Winik recounts the tense months leading to the Civil War, focusing on Lincoln and the efforts to prevent national conflict in a gripping narrative of diplomacy and destiny.",
    imageUrls: ["/uploads/1861-the-lost-peace.jpg"],
  },
  {
    bookName:
      "Daughters of the Bamboo Grove: From China to America, a True Story of Abduction, Adoption, and Separated Twins",
    author: "Barbara Demick",
    rating: 4.41,
    genre: "History",
    condition: "Average",
    description:
      "Barbara Demick tells the true story of Chinese twins separated by the one-child policy and later reunited, revealing the emotional toll of international adoption.",
    imageUrls: ["/uploads/daughters-of-the-bamboo-grove.jpg"],
  },

  // =================== HORROR ===================
  {
    bookName: "The Devils",
    author: "Joe Abercrombie",
    rating: 4.33,
    genre: "Horror",
    condition: "Excellent",
    description:
      "Joe Abercrombie’s The Devils follows Brother Diaz, who leads an unholy army of criminals and magicians on a divine mission that blurs the line between faith and monstrosity.",
    imageUrls: ["/uploads/the-devils.jpg"],
  },
  {
    bookName: "The Manor of Dreams",
    author: "Christina Li",
    rating: 3.68,
    genre: "Horror",
    condition: "Good",
    description:
      "Christina Li’s gothic horror novel explores family secrets and vengeance within a crumbling California estate, weaving together haunting dual timelines.",
    imageUrls: ["/uploads/the-manor-of-dreams.jpg"],
  },
  {
    bookName: "We Live Here Now",
    author: "Sarah Pinborough",
    rating: 3.78,
    genre: "Horror",
    condition: "Good",
    description:
      "After surviving a near-fatal illness, Emily moves to a secluded country house only to find it haunted—or perhaps her own mind is betraying her—in this psychological ghost story.",
    imageUrls: ["/uploads/we-live-here-now.jpg"],
  },
  {
    bookName: "Immaculate Conception",
    author: "Ling Ling Huang",
    rating: 4.02,
    genre: "Horror",
    condition: "Excellent",
    description:
      "In the high-stakes world of contemporary art, Enka’s obsession with Mathilde spirals into a terrifying exploration of creativity, possession, and identity.",
    imageUrls: ["/uploads/immaculate-conception.jpg"],
  },
  {
    bookName: "Out of Air",
    author: "Rachel Reiss",
    rating: 3.65,
    genre: "Horror",
    condition: "Average",
    description:
      "A terrifying underwater nightmare unfolds as Phibs and her friends dive a mysterious reef that awakens dark forces within them. A gripping story of transformation and trust.",
    imageUrls: ["/uploads/out-of-air.jpg"],
  },
  {
    bookName: "The Starving Saints",
    author: "Caitlin Starling",
    rating: 3.78,
    genre: "Horror",
    condition: "Good",
    description:
      "In a besieged medieval castle, divine figures bring food and healing—at a terrible cost. A chilling story of faith, madness, and survival.",
    imageUrls: ["/uploads/the-starving-saints.jpg"],
  },

  // =================== NON FICTION ===================
  {
    bookName: "Mark Twain",
    author: "Ron Chernow",
    rating: 4.19,
    genre: "Non Fiction",
    condition: "Good",
    description:
      "Ron Chernow’s biography of Mark Twain captures the humorist’s public triumphs and private struggles, offering an intimate portrait of America’s literary icon.",
    imageUrls: ["/uploads/mark-twain.jpg"],
  },
  {
    bookName: "Is a River Alive?",
    author: "Robert Macfarlane",
    rating: 4.32,
    genre: "Non Fiction",
    condition: "Excellent",
    description:
      "Robert Macfarlane journeys through Ecuador, India, and Canada to explore rivers as living beings deserving of legal and moral recognition.",
    imageUrls: ["/uploads/is-a-river-alive.jpg"],
  },
  {
    bookName: "Bad Friend: How Women Revolutionized Modern Friendship",
    author: "Tiffany Watt Smith",
    rating: 3.48,
    genre: "Non Fiction",
    condition: "Bad",
    description:
      "Tiffany Watt Smith examines the complexities and realities of female friendship, moving beyond the idealized portrayals seen in popular culture.",
    imageUrls: ["/uploads/bad-friend.jpg"],
  },
  {
    bookName:
      "Aggregated Discontent: Confessions of the Last Normal Woman",
    author: "Harron Walker",
    rating: 3.75,
    genre: "Non Fiction",
    condition: "Average",
    description:
      "Harron Walker blends memoir and cultural critique in essays exploring identity, gender politics, and the pressures of modern womanhood.",
    imageUrls: ["/uploads/aggregated-discontent.jpg"],
  },
  {
    bookName:
      "Forest Euphoria: The Abounding Queerness of Nature",
    author: "Patricia Ononiwu Kaishian",
    rating: 4.04,
    genre: "Non Fiction",
    condition: "Good",
    description:
      "Kaishian intertwines memoir, science, and queer theory to reveal the beauty of diversity in nature and the interconnectedness of life.",
    imageUrls: ["/uploads/forest-euphoria.jpg"],
  },
  {
    bookName:
      "The True Happiness Company: How a Girl Like Me Falls for a Cult Like That",
    author: "Veena Dinavahi",
    rating: 4.18,
    genre: "Non Fiction",
    condition: "Good",
    description:
      "Veena Dinavahi recounts her journey through a self-help cult and her path to self-discovery in this darkly funny and moving memoir.",
    imageUrls: ["/uploads/the-true-happiness-company.jpg"],
  },

  // =================== PSYCHOLOGY ===================
  {
    bookName: "The Let Them Theory",
    author: "Mel Robbins",
    rating: 4.14,
    genre: "Psychology",
    condition: "Good",
    description:
      "Mel Robbins presents a powerful mindset tool—Let Them—that helps readers stop trying to control others and focus on what truly matters for happiness and success.",
    imageUrls: ["/uploads/the-let-them-theory.jpg"],
  },
  {
    bookName: "The Psychology of Money",
    author: "Morgan Housel",
    rating: 4.29,
    genre: "Psychology",
    condition: "Good",
    description:
      "Morgan Housel explores how behavior influences financial success more than knowledge, revealing the psychological patterns behind money decisions.",
    imageUrls: ["/uploads/the-psychology-of-money.jpg"],
  },
  {
    bookName:
      "Revenge of the Tipping Point: Overstories, Superspreaders, and the Rise of Social Engineering",
    author: "Malcolm Gladwell",
    rating: 4.04,
    genre: "Psychology",
    condition: "Good",
    description:
      "Malcolm Gladwell revisits social epidemics and tipping points to reveal how social engineering shapes modern crises and movements.",
    imageUrls: ["/uploads/revenge-of-the-tipping-point.jpg"],
  },
  {
    bookName: "Don't Believe Everything You Think",
    author: "Joseph Nguyen",
    rating: 3.79,
    genre: "Psychology",
    condition: "Good",
    description:
      "Joseph Nguyen teaches readers to overcome anxiety and self-sabotage by understanding the true nature of thought and consciousness.",
    imageUrls: ["/uploads/dont-believe-everything-you-think.jpg"],
  },
  {
    bookName:
      "Think Again: The Power of Knowing What You Don't Know",
    author: "Adam M. Grant",
    rating: 4.13,
    genre: "Psychology",
    condition: "Good",
    description:
      "Adam Grant explores the power of rethinking and changing one’s mind to foster creativity, adaptability, and growth in a complex world.",
    imageUrls: ["/uploads/think-again.jpg"],
  },
  {
    bookName:
      "Breath: The New Science of a Lost Art",
    author: "James Nestor",
    rating: 4.15,
    genre: "Psychology",
    condition: "Excellent",
    description:
      "James Nestor reveals the transformative power of proper breathing on health, performance, and mental well-being through science and ancient wisdom.",
    imageUrls: ["/uploads/breath.jpg"],
  },
];

async function seedBooks() {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Remove existing books
    await Book.deleteMany();

    // Add price to each book based on condition
    const booksWithPrice = books.map(book => {
      let price = 0;
      switch (book.condition.toLowerCase()) {
        case "excellent":
          price = 300;
          break;
        case "good":
          price = 250;
          break;
        case "average":
          price = 200;
          break;
        case "bad":
          price = 150;
          break;
      }
      return { ...book, price };
    });

    await Book.insertMany(booksWithPrice);
    console.log("🌱 Books inserted successfully!");

    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error seeding books:", err);
  }
}

// Run the seed function
seedBooks();