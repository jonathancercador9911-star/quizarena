import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

interface QuestionData {
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: "A" | "B" | "C" | "D";
  difficulty: "easy" | "medium" | "hard";
}

interface CategorySeed {
  name: string;
  icon: string;
  bankDescription: string;
  questions: QuestionData[];
}

const DATA: CategorySeed[] = [
  {
    name: "Ciencia y Tecnología",
    icon: "🔬",
    bankDescription: "Preguntas sobre ciencia, tecnología, informática y descubrimientos.",
    questions: [
      { text: "¿Cuál es el planeta más grande del sistema solar?", optionA: "Júpiter", optionB: "Saturno", optionC: "Neptuno", optionD: "Urano", correctOption: "A", difficulty: "easy" },
      { text: "¿Cuántos bits tiene un byte?", optionA: "8", optionB: "4", optionC: "16", optionD: "32", correctOption: "A", difficulty: "easy" },
      { text: "¿Qué gas es el más abundante en la atmósfera terrestre?", optionA: "Nitrógeno", optionB: "Oxígeno", optionC: "Dióxido de carbono", optionD: "Argón", correctOption: "A", difficulty: "easy" },
      { text: "¿Cuál es el símbolo químico del hierro?", optionA: "Fe", optionB: "Hi", optionC: "Ir", optionD: "Au", correctOption: "A", difficulty: "easy" },
      { text: "¿Quién desarrolló la teoría de la relatividad?", optionA: "Albert Einstein", optionB: "Isaac Newton", optionC: "Stephen Hawking", optionD: "Niels Bohr", correctOption: "A", difficulty: "easy" },
      { text: "¿Cuál es la velocidad de la luz en el vacío?", optionA: "300.000 km/s", optionB: "150.000 km/s", optionC: "450.000 km/s", optionD: "100.000 km/s", correctOption: "A", difficulty: "medium" },
      { text: "¿Cuántos cromosomas tiene una célula humana normal?", optionA: "46", optionB: "23", optionC: "48", optionD: "44", correctOption: "A", difficulty: "medium" },
      { text: "¿Qué lenguaje de programación fue creado por Guido van Rossum?", optionA: "Python", optionB: "Java", optionC: "Ruby", optionD: "Perl", correctOption: "A", difficulty: "medium" },
      { text: "¿Cuántas lunas tiene Marte?", optionA: "2", optionB: "1", optionC: "3", optionD: "0", correctOption: "A", difficulty: "medium" },
      { text: "¿Qué empresa creó el sistema operativo Android?", optionA: "Google", optionB: "Apple", optionC: "Microsoft", optionD: "Samsung", correctOption: "A", difficulty: "easy" },
      { text: "¿Qué significa la sigla ADN?", optionA: "Ácido Desoxirribonucleico", optionB: "Ácido Dinucleico Nitroso", optionC: "Aminoácido Doble Nucleado", optionD: "Ácido Difusivo Natural", correctOption: "A", difficulty: "medium" },
      { text: "¿Cuál es el número aproximado de Avogadro?", optionA: "6,02 × 10²³", optionB: "3,14 × 10²³", optionC: "9,81 × 10²³", optionD: "1,67 × 10²³", correctOption: "A", difficulty: "hard" },
      { text: "¿En qué año se lanzó el primer iPhone?", optionA: "2007", optionB: "2005", optionC: "2009", optionD: "2003", correctOption: "A", difficulty: "easy" },
      { text: "¿Cuál es la unidad básica de la vida?", optionA: "La célula", optionB: "El átomo", optionC: "El tejido", optionD: "El orgánulo", correctOption: "A", difficulty: "easy" },
      { text: "¿Qué proceso usan las plantas para producir energía a partir de la luz solar?", optionA: "Fotosíntesis", optionB: "Respiración celular", optionC: "Quimiosíntesis", optionD: "Mitosis", correctOption: "A", difficulty: "easy" },
    ],
  },
  {
    name: "Historia",
    icon: "📜",
    bankDescription: "Preguntas sobre eventos, personajes y épocas históricas.",
    questions: [
      { text: "¿En qué año llegó Cristóbal Colón a América?", optionA: "1492", optionB: "1488", optionC: "1498", optionD: "1502", correctOption: "A", difficulty: "easy" },
      { text: "¿Quién fue el primer presidente de los Estados Unidos?", optionA: "George Washington", optionB: "Abraham Lincoln", optionC: "Thomas Jefferson", optionD: "John Adams", correctOption: "A", difficulty: "easy" },
      { text: "¿En qué año comenzó la Primera Guerra Mundial?", optionA: "1914", optionB: "1916", optionC: "1912", optionD: "1918", correctOption: "A", difficulty: "easy" },
      { text: "¿En qué año cayó el Muro de Berlín?", optionA: "1989", optionB: "1991", optionC: "1987", optionD: "1985", correctOption: "A", difficulty: "easy" },
      { text: "¿Qué civilización construyó las pirámides de Giza?", optionA: "Egipcia", optionB: "Griega", optionC: "Romana", optionD: "Maya", correctOption: "A", difficulty: "easy" },
      { text: "¿Cuándo fue la Revolución Francesa?", optionA: "1789", optionB: "1776", optionC: "1804", optionD: "1815", correctOption: "A", difficulty: "medium" },
      { text: "¿Quién fue el primer ser humano en pisar la Luna?", optionA: "Neil Armstrong", optionB: "Buzz Aldrin", optionC: "Yuri Gagarin", optionD: "John Glenn", correctOption: "A", difficulty: "easy" },
      { text: "¿En qué año terminó la Segunda Guerra Mundial?", optionA: "1945", optionB: "1943", optionC: "1947", optionD: "1941", correctOption: "A", difficulty: "easy" },
      { text: "¿Quién escribió el Quijote?", optionA: "Miguel de Cervantes", optionB: "Lope de Vega", optionC: "Francisco de Quevedo", optionD: "Calderón de la Barca", correctOption: "A", difficulty: "easy" },
      { text: "¿Cuándo fue la Declaración de Independencia de Argentina?", optionA: "1816", optionB: "1810", optionC: "1825", optionD: "1821", correctOption: "A", difficulty: "medium" },
      { text: "¿En qué país nació Napoleón Bonaparte?", optionA: "Córcega (Francia)", optionB: "Italia", optionC: "Francia continental", optionD: "Bélgica", correctOption: "A", difficulty: "hard" },
      { text: "¿Cuál fue el primer país en usar la imprenta de tipos móviles en Europa?", optionA: "Alemania", optionB: "Italia", optionC: "Francia", optionD: "Países Bajos", correctOption: "A", difficulty: "hard" },
      { text: "¿Qué faraón fue enterrado en la tumba descubierta por Howard Carter en 1922?", optionA: "Tutankamón", optionB: "Ramsés II", optionC: "Amenofis III", optionD: "Kefrén", correctOption: "A", difficulty: "medium" },
      { text: "¿Qué evento desencadenó directamente la Primera Guerra Mundial?", optionA: "El asesinato del archiduque Francisco Fernando", optionB: "La invasión de Polonia", optionC: "La caída de la Bolsa de Nueva York", optionD: "La Revolución Rusa", correctOption: "A", difficulty: "medium" },
      { text: "¿En qué año se fundó la ciudad de Roma según la tradición?", optionA: "753 a.C.", optionB: "500 a.C.", optionC: "1000 a.C.", optionD: "250 a.C.", correctOption: "A", difficulty: "hard" },
    ],
  },
  {
    name: "Geografía",
    icon: "🌍",
    bankDescription: "Preguntas sobre países, capitales, accidentes geográficos y mapas.",
    questions: [
      { text: "¿Cuál es el río más largo del mundo?", optionA: "Nilo", optionB: "Amazonas", optionC: "Yangtsé", optionD: "Misisipi", correctOption: "A", difficulty: "medium" },
      { text: "¿Cuál es el desierto más extenso del mundo?", optionA: "Antártida", optionB: "Sahara", optionC: "Gobi", optionD: "Arábigo", correctOption: "A", difficulty: "hard" },
      { text: "¿Cuál es el país más grande del mundo por superficie?", optionA: "Rusia", optionB: "Canadá", optionC: "China", optionD: "Estados Unidos", correctOption: "A", difficulty: "easy" },
      { text: "¿En qué continente se encuentra Madagascar?", optionA: "África", optionB: "Asia", optionC: "Oceanía", optionD: "América", correctOption: "A", difficulty: "easy" },
      { text: "¿Cuál es la capital de Australia?", optionA: "Canberra", optionB: "Sídney", optionC: "Melbourne", optionD: "Perth", correctOption: "A", difficulty: "medium" },
      { text: "¿Cuál es el lago más profundo del mundo?", optionA: "Lago Baikal", optionB: "Mar Caspio", optionC: "Lago Titicaca", optionD: "Lago Superior", correctOption: "A", difficulty: "medium" },
      { text: "¿En qué país se encuentra el Monte Everest?", optionA: "Nepal", optionB: "India", optionC: "China", optionD: "Bután", correctOption: "A", difficulty: "easy" },
      { text: "¿Cuál es la capital de Canadá?", optionA: "Ottawa", optionB: "Toronto", optionC: "Vancouver", optionD: "Montreal", correctOption: "A", difficulty: "medium" },
      { text: "¿Cuál es el océano más grande del mundo?", optionA: "Pacífico", optionB: "Atlántico", optionC: "Índico", optionD: "Ártico", correctOption: "A", difficulty: "easy" },
      { text: "¿Cuántos países conforman América del Sur?", optionA: "12", optionB: "10", optionC: "13", optionD: "14", correctOption: "A", difficulty: "hard" },
      { text: "¿Cuál es el punto más alto de América, el Aconcagua?", optionA: "Argentina", optionB: "Chile", optionC: "Bolivia", optionD: "Perú", correctOption: "A", difficulty: "medium" },
      { text: "¿Qué país tiene más fronteras terrestres compartidas?", optionA: "China y Rusia (14 cada uno)", optionB: "Brasil", optionC: "Estados Unidos", optionD: "India", correctOption: "A", difficulty: "hard" },
      { text: "¿Cuál es la ciudad más poblada del mundo?", optionA: "Tokio", optionB: "Delhi", optionC: "Shanghái", optionD: "São Paulo", correctOption: "A", difficulty: "medium" },
      { text: "¿Qué estrecho separa Europa de África?", optionA: "Gibraltar", optionB: "Bering", optionC: "Malaca", optionD: "Ormuz", correctOption: "A", difficulty: "easy" },
      { text: "¿Cuál es el país más pequeño del mundo?", optionA: "Ciudad del Vaticano", optionB: "Mónaco", optionC: "San Marino", optionD: "Liechtenstein", correctOption: "A", difficulty: "easy" },
    ],
  },
  {
    name: "Deportes",
    icon: "⚽",
    bankDescription: "Preguntas sobre deportes, competiciones y atletas del mundo.",
    questions: [
      { text: "¿Cuántos jugadores tiene un equipo de fútbol en el campo de juego?", optionA: "11", optionB: "10", optionC: "12", optionD: "9", correctOption: "A", difficulty: "easy" },
      { text: "¿En qué año se disputó el primer Mundial de fútbol?", optionA: "1930", optionB: "1934", optionC: "1926", optionD: "1938", correctOption: "A", difficulty: "medium" },
      { text: "¿Cuántos anillos tiene el símbolo de los Juegos Olímpicos?", optionA: "5", optionB: "4", optionC: "6", optionD: "3", correctOption: "A", difficulty: "easy" },
      { text: "¿En qué ciudad se celebraron los primeros Juegos Olímpicos modernos (1896)?", optionA: "Atenas", optionB: "París", optionC: "Londres", optionD: "Berlín", correctOption: "A", difficulty: "medium" },
      { text: "¿Cuántos puntos vale un try en rugby?", optionA: "5", optionB: "3", optionC: "6", optionD: "4", correctOption: "A", difficulty: "medium" },
      { text: "¿Cuántos sets puede durar como máximo un partido de tenis de Grand Slam masculino?", optionA: "5", optionB: "3", optionC: "7", optionD: "4", correctOption: "A", difficulty: "easy" },
      { text: "¿En qué deporte se utiliza el término 'smash'?", optionA: "Tenis y bádminton", optionB: "Fútbol", optionC: "Natación", optionD: "Atletismo", correctOption: "A", difficulty: "easy" },
      { text: "¿Cuántos jugadores forman un equipo de baloncesto en cancha?", optionA: "5", optionB: "6", optionC: "4", optionD: "7", correctOption: "A", difficulty: "easy" },
      { text: "¿Qué país ha ganado más Copas del Mundo de fútbol?", optionA: "Brasil (5)", optionB: "Alemania (4)", optionC: "Italia (4)", optionD: "Argentina (3)", correctOption: "A", difficulty: "medium" },
      { text: "¿Cuántos kilómetros mide un maratón?", optionA: "42,195 km", optionB: "40 km", optionC: "45 km", optionD: "42 km", correctOption: "A", difficulty: "medium" },
      { text: "¿En qué deporte se compite por el Trofeo de Wimbledon?", optionA: "Tenis", optionB: "Críquet", optionC: "Golf", optionD: "Polo", correctOption: "A", difficulty: "easy" },
      { text: "¿Cuántos jugadores hay en un equipo de vóley en cancha?", optionA: "6", optionB: "5", optionC: "7", optionD: "8", correctOption: "A", difficulty: "easy" },
      { text: "¿Qué país de América Latina ha ganado más medallas olímpicas en total?", optionA: "Cuba", optionB: "Brasil", optionC: "Argentina", optionD: "México", correctOption: "A", difficulty: "hard" },
      { text: "¿En qué deporte se usa el término 'eagle' para describir un resultado?", optionA: "Golf", optionB: "Fútbol americano", optionC: "Béisbol", optionD: "Críquet", correctOption: "A", difficulty: "medium" },
      { text: "¿Cuántos metros tiene una piscina olímpica?", optionA: "50", optionB: "25", optionC: "100", optionD: "75", correctOption: "A", difficulty: "easy" },
    ],
  },
  {
    name: "Entretenimiento",
    icon: "🎬",
    bankDescription: "Preguntas sobre cine, música, series y cultura pop.",
    questions: [
      { text: "¿Qué película ganó el primer Oscar a Mejor Película de la historia?", optionA: "Wings (1927)", optionB: "Casablanca", optionC: "Lo que el viento se llevó", optionD: "Ben-Hur", correctOption: "A", difficulty: "hard" },
      { text: "¿Quién interpretó a Iron Man en el Universo Cinematográfico de Marvel?", optionA: "Robert Downey Jr.", optionB: "Chris Evans", optionC: "Chris Hemsworth", optionD: "Mark Ruffalo", correctOption: "A", difficulty: "easy" },
      { text: "¿En qué año se estrenó la primera película de Star Wars?", optionA: "1977", optionB: "1975", optionC: "1980", optionD: "1983", correctOption: "A", difficulty: "medium" },
      { text: "¿Qué banda lanzó el álbum 'Thriller' en 1982?", optionA: "Michael Jackson (solista)", optionB: "The Jackson 5", optionC: "Prince", optionD: "Earth, Wind & Fire", correctOption: "A", difficulty: "medium" },
      { text: "¿Cuál es el nombre del mago protagonista de la saga de J.K. Rowling?", optionA: "Harry Potter", optionB: "Hermione Granger", optionC: "Ron Weasley", optionD: "Draco Malfoy", correctOption: "A", difficulty: "easy" },
      { text: "¿En qué serie de TV aparece el personaje Walter White?", optionA: "Breaking Bad", optionB: "Better Call Saul", optionC: "Ozark", optionD: "Narcos", correctOption: "A", difficulty: "easy" },
      { text: "¿Quién dirigió la trilogía de El Señor de los Anillos?", optionA: "Peter Jackson", optionB: "Steven Spielberg", optionC: "James Cameron", optionD: "Christopher Nolan", correctOption: "A", difficulty: "easy" },
      { text: "¿Qué canción de Queen es considerada el himno por excelencia del rock?", optionA: "Bohemian Rhapsody", optionB: "We Will Rock You", optionC: "We Are the Champions", optionD: "Don't Stop Me Now", correctOption: "A", difficulty: "easy" },
      { text: "¿Cuántas temporadas tiene la serie 'Game of Thrones'?", optionA: "8", optionB: "7", optionC: "6", optionD: "9", correctOption: "A", difficulty: "medium" },
      { text: "¿Qué película animada de Disney trata sobre la historia de Elsa y Anna?", optionA: "Frozen", optionB: "Brave", optionC: "Tangled", optionD: "Moana", correctOption: "A", difficulty: "easy" },
      { text: "¿Quién compuso la música de la saga de Harry Potter?", optionA: "John Williams", optionB: "Hans Zimmer", optionC: "Howard Shore", optionD: "Danny Elfman", correctOption: "A", difficulty: "hard" },
      { text: "¿En qué país se desarrolla la trama de la serie 'La Casa de Papel'?", optionA: "España", optionB: "México", optionC: "Argentina", optionD: "Italia", correctOption: "A", difficulty: "easy" },
      { text: "¿Qué actor interpretó al Joker en la película de 2019?", optionA: "Joaquin Phoenix", optionB: "Heath Ledger", optionC: "Jared Leto", optionD: "Jack Nicholson", correctOption: "A", difficulty: "easy" },
      { text: "¿Cuál es el videojuego más vendido de la historia?", optionA: "Minecraft", optionB: "Tetris", optionC: "GTA V", optionD: "Super Mario Bros", correctOption: "A", difficulty: "hard" },
      { text: "¿Qué artista tiene el récord de más Grammy ganados en la historia?", optionA: "Beyoncé", optionB: "Taylor Swift", optionC: "Michael Jackson", optionD: "Jay-Z", correctOption: "A", difficulty: "hard" },
    ],
  },
  {
    name: "Arte y Literatura",
    icon: "📚",
    bankDescription: "Preguntas sobre arte, pintura, escultura, literatura y escritores.",
    questions: [
      { text: "¿Quién pintó La Mona Lisa?", optionA: "Leonardo da Vinci", optionB: "Miguel Ángel", optionC: "Rafael Sanzio", optionD: "Botticelli", correctOption: "A", difficulty: "easy" },
      { text: "¿Quién escribió '100 años de soledad'?", optionA: "Gabriel García Márquez", optionB: "Julio Cortázar", optionC: "Pablo Neruda", optionD: "Mario Vargas Llosa", correctOption: "A", difficulty: "easy" },
      { text: "¿En qué museo se encuentra La Mona Lisa?", optionA: "Museo del Louvre (París)", optionB: "Museo del Prado (Madrid)", optionC: "Galería Uffizi (Florencia)", optionD: "Museo Metropolitano (Nueva York)", correctOption: "A", difficulty: "medium" },
      { text: "¿Quién esculpió El David?", optionA: "Miguel Ángel", optionB: "Donatello", optionC: "Bernini", optionD: "Rodin", correctOption: "A", difficulty: "easy" },
      { text: "¿Quién escribió 'Hamlet'?", optionA: "William Shakespeare", optionB: "Charles Dickens", optionC: "Molière", optionD: "Dante Alighieri", correctOption: "A", difficulty: "easy" },
      { text: "¿Qué artista cortó su propia oreja?", optionA: "Vincent van Gogh", optionB: "Paul Gauguin", optionC: "Salvador Dalí", optionD: "Pablo Picasso", correctOption: "A", difficulty: "easy" },
      { text: "¿Quién escribió 'El Principito'?", optionA: "Antoine de Saint-Exupéry", optionB: "Lewis Carroll", optionC: "Jules Verne", optionD: "Roald Dahl", correctOption: "A", difficulty: "easy" },
      { text: "¿A qué movimiento artístico pertenece la obra 'La persistencia de la memoria' de Dalí?", optionA: "Surrealismo", optionB: "Cubismo", optionC: "Impresionismo", optionD: "Expresionismo", correctOption: "A", difficulty: "medium" },
      { text: "¿Quién escribió 'Crimen y Castigo'?", optionA: "Fiódor Dostoievski", optionB: "León Tolstói", optionC: "Antón Chéjov", optionD: "Iván Turguénev", correctOption: "A", difficulty: "medium" },
      { text: "¿Qué pintor español es famoso por el movimiento cubista?", optionA: "Pablo Picasso", optionB: "Francisco Goya", optionC: "Salvador Dalí", optionD: "Joan Miró", correctOption: "A", difficulty: "easy" },
      { text: "¿Quién escribió 'Don Juan Tenorio'?", optionA: "José Zorrilla", optionB: "Lope de Vega", optionC: "Calderón de la Barca", optionD: "Tirso de Molina", correctOption: "A", difficulty: "hard" },
      { text: "¿Cuál es la obra maestra de Dante Alighieri?", optionA: "La Divina Comedia", optionB: "El Decamerón", optionC: "La Eneida", optionD: "La Odisea", correctOption: "A", difficulty: "medium" },
      { text: "¿Qué arquitecto diseñó la Sagrada Familia de Barcelona?", optionA: "Antoni Gaudí", optionB: "Le Corbusier", optionC: "Frank Lloyd Wright", optionD: "Renzo Piano", correctOption: "A", difficulty: "easy" },
      { text: "¿Quién escribió '1984'?", optionA: "George Orwell", optionB: "Aldous Huxley", optionC: "Ray Bradbury", optionD: "H.G. Wells", correctOption: "A", difficulty: "medium" },
      { text: "¿De qué país fue premio Nobel de Literatura Gabriel García Márquez?", optionA: "Colombia", optionB: "Argentina", optionC: "México", optionD: "Perú", correctOption: "A", difficulty: "easy" },
    ],
  },
  {
    name: "Naturaleza",
    icon: "🌿",
    bankDescription: "Preguntas sobre animales, plantas, ecosistemas y el mundo natural.",
    questions: [
      { text: "¿Cuál es el animal terrestre más rápido?", optionA: "Guepardo", optionB: "León", optionC: "Caballo", optionD: "Avestruz", correctOption: "A", difficulty: "easy" },
      { text: "¿Cuántos corazones tiene un pulpo?", optionA: "3", optionB: "1", optionC: "2", optionD: "4", correctOption: "A", difficulty: "medium" },
      { text: "¿Cuál es el animal más grande del mundo?", optionA: "Ballena azul", optionB: "Elefante africano", optionC: "Tiburón ballena", optionD: "Jirafa", correctOption: "A", difficulty: "easy" },
      { text: "¿Cuántas especies de pingüinos existen aproximadamente?", optionA: "18", optionB: "10", optionC: "25", optionD: "5", correctOption: "A", difficulty: "hard" },
      { text: "¿Qué árbol es el más alto del mundo?", optionA: "Secuoya gigante", optionB: "Eucalipto", optionC: "Baobab", optionD: "Pino", correctOption: "A", difficulty: "medium" },
      { text: "¿Cuántos años puede vivir una tortuga gigante de Galápagos?", optionA: "Más de 150 años", optionB: "Hasta 80 años", optionC: "Hasta 50 años", optionD: "Hasta 100 años", correctOption: "A", difficulty: "medium" },
      { text: "¿Cuál es el único mamífero capaz de volar?", optionA: "Murciélago", optionB: "Ardilla voladora", optionC: "Zarigüeya", optionD: "Lemur volador", correctOption: "A", difficulty: "easy" },
      { text: "¿De qué se alimenta el oso panda gigante principalmente?", optionA: "Bambú", optionB: "Peces", optionC: "Hojas de eucalipto", optionD: "Frutas", correctOption: "A", difficulty: "easy" },
      { text: "¿Cuántos lados tiene un panal de abeja?", optionA: "6", optionB: "4", optionC: "5", optionD: "8", correctOption: "A", difficulty: "easy" },
      { text: "¿Qué porcentaje de la Tierra está cubierto por océanos?", optionA: "71%", optionB: "50%", optionC: "60%", optionD: "80%", correctOption: "A", difficulty: "medium" },
      { text: "¿Cuál es el veneno más potente del reino animal?", optionA: "Medusa caja (Chironex fleckeri)", optionB: "Cobra real", optionC: "Rana dardo dorada", optionD: "Escorpión deathstalker", correctOption: "A", difficulty: "hard" },
      { text: "¿Cuántas patas tiene una araña?", optionA: "8", optionB: "6", optionC: "10", optionD: "12", correctOption: "A", difficulty: "easy" },
      { text: "¿Qué es la fotosíntesis?", optionA: "El proceso por el que las plantas convierten luz en energía", optionB: "La reproducción de los hongos", optionC: "La digestión de los herbívoros", optionD: "La respiración de los peces", correctOption: "A", difficulty: "easy" },
      { text: "¿Cuál es el mamífero marino más inteligente?", optionA: "Delfín", optionB: "Ballena jorobada", optionC: "Foca", optionD: "Manatí", correctOption: "A", difficulty: "medium" },
      { text: "¿En qué continente habita el canguro salvaje de forma natural?", optionA: "Oceanía (Australia)", optionB: "África", optionC: "América del Sur", optionD: "Asia", correctOption: "A", difficulty: "easy" },
    ],
  },
  {
    name: "Cultura General",
    icon: "🧠",
    bankDescription: "Preguntas variadas de conocimiento general, curiosidades y datos del mundo.",
    questions: [
      { text: "¿Cuántos países son miembros de la ONU?", optionA: "193", optionB: "180", optionC: "205", optionD: "170", correctOption: "A", difficulty: "hard" },
      { text: "¿Cuál es la moneda oficial de Japón?", optionA: "Yen", optionB: "Won", optionC: "Yuan", optionD: "Ringgit", correctOption: "A", difficulty: "easy" },
      { text: "¿Qué idioma tiene más hablantes nativos en el mundo?", optionA: "Chino mandarín", optionB: "Inglés", optionC: "Español", optionD: "Hindi", correctOption: "A", difficulty: "medium" },
      { text: "¿Cuántos colores tiene el arco iris?", optionA: "7", optionB: "5", optionC: "6", optionD: "8", correctOption: "A", difficulty: "easy" },
      { text: "¿Cuál es el metal más caro del mundo?", optionA: "Rodio", optionB: "Oro", optionC: "Platino", optionD: "Paladio", correctOption: "A", difficulty: "hard" },
      { text: "¿Qué país tiene la mayor cantidad de pirámides del mundo?", optionA: "Sudán", optionB: "Egipto", optionC: "México", optionD: "Perú", correctOption: "A", difficulty: "hard" },
      { text: "¿Cuántas horas tiene un día en el planeta Júpiter?", optionA: "Aproximadamente 10 horas", optionB: "24 horas", optionC: "48 horas", optionD: "6 horas", correctOption: "A", difficulty: "hard" },
      { text: "¿Cuánto es 2 elevado a la potencia 10?", optionA: "1024", optionB: "512", optionC: "2048", optionD: "100", correctOption: "A", difficulty: "medium" },
      { text: "¿Cuál es el hueso más largo del cuerpo humano?", optionA: "Fémur", optionB: "Tibia", optionC: "Húmero", optionD: "Radio", correctOption: "A", difficulty: "easy" },
      { text: "¿Cuántos lados tiene un hexágono?", optionA: "6", optionB: "5", optionC: "7", optionD: "8", correctOption: "A", difficulty: "easy" },
      { text: "¿En qué ciudad se encuentra la Torre Eiffel?", optionA: "París", optionB: "Bruselas", optionC: "Lyon", optionD: "Marsella", correctOption: "A", difficulty: "easy" },
      { text: "¿Qué instrumento se utiliza para medir la temperatura?", optionA: "Termómetro", optionB: "Barómetro", optionC: "Higrómetro", optionD: "Anemómetro", correctOption: "A", difficulty: "easy" },
      { text: "¿Cuántos continentes hay en el mundo?", optionA: "7", optionB: "5", optionC: "6", optionD: "8", correctOption: "A", difficulty: "easy" },
      { text: "¿Cuál es el país más visitado por turistas en el mundo?", optionA: "Francia", optionB: "España", optionC: "Estados Unidos", optionD: "China", correctOption: "A", difficulty: "medium" },
      { text: "¿Cuántos metros cuadrados tiene una cancha de fútbol reglamentaria como máximo?", optionA: "10.800 m²", optionB: "7.140 m²", optionC: "8.250 m²", optionD: "9.600 m²", correctOption: "A", difficulty: "hard" },
    ],
  },
  {
    name: "Scout",
    icon: "⚜️",
    bankDescription: "Preguntas sobre el movimiento scout, técnicas de campismo, nudos y valores.",
    questions: [
      { text: "¿Quién fundó el movimiento scout?", optionA: "Robert Baden-Powell", optionB: "Ernest Thompson Seton", optionC: "William Boyce", optionD: "Daniel Beard", correctOption: "A", difficulty: "easy" },
      { text: "¿En qué año se fundó el movimiento scout?", optionA: "1907", optionB: "1900", optionC: "1912", optionD: "1895", correctOption: "A", difficulty: "medium" },
      { text: "¿Cuál es la promesa scout en su versión más común en español?", optionA: "Prometo hacer todo lo posible por cumplir mis deberes", optionB: "Prometo ser fuerte y valiente siempre", optionC: "Prometo defender a los débiles", optionD: "Prometo ser leal a mi patria ante todo", correctOption: "A", difficulty: "medium" },
      { text: "¿Cuál es el lema scout internacional?", optionA: "Be Prepared / Siempre Listo", optionB: "Do Your Best / Haz lo Mejor", optionC: "Help Others / Ayuda Siempre", optionD: "One for All / Todos por Uno", correctOption: "A", difficulty: "easy" },
      { text: "¿Cuántos puntos tiene la flor de lis del símbolo scout?", optionA: "3", optionB: "5", optionC: "4", optionD: "6", correctOption: "A", difficulty: "easy" },
      { text: "¿Cómo se llama el nudo que se usa para unir dos cuerdas del mismo grosor?", optionA: "Nudo cuadrado (rizo)", optionB: "As de guía", optionC: "Vuelta de escota", optionD: "Nudo de ballestrinque", correctOption: "A", difficulty: "medium" },
      { text: "¿Para qué sirve el nudo 'as de guía'?", optionA: "Para hacer un lazo fijo que no se aprieta", optionB: "Para unir dos cuerdas", optionC: "Para amarrar al inicio de una cuerda", optionD: "Para hacer una escalera de cuerda", correctOption: "A", difficulty: "medium" },
      { text: "¿Cuál es la primera rama del escultismo (la de los más pequeños)?", optionA: "Lobatos / Manada", optionB: "Scouts / Tropa", optionC: "Rovers / Clan", optionD: "Pioneros / Unidad", correctOption: "A", difficulty: "easy" },
      { text: "¿En qué isla realizó Baden-Powell el primer campamento scout experimental en 1907?", optionA: "Brownsea", optionB: "Wight", optionC: "Skye", optionD: "Arran", correctOption: "A", difficulty: "hard" },
      { text: "¿Cuántos puntos tiene la Ley Scout según la versión clásica?", optionA: "10", optionB: "7", optionC: "12", optionD: "8", correctOption: "A", difficulty: "medium" },
      { text: "¿Qué es el 'morse' en el contexto scout?", optionA: "Un sistema de comunicación con puntos y rayas", optionB: "Un tipo de nudo", optionC: "Una técnica de orientación", optionD: "Un juego de campamento", correctOption: "A", difficulty: "easy" },
      { text: "¿Cómo se orienta una brújula para encontrar el norte?", optionA: "La aguja roja siempre apunta al norte magnético", optionB: "La aguja blanca siempre apunta al norte", optionC: "Se orienta mirando al sol al mediodía", optionD: "La aguja negra apunta al norte", correctOption: "A", difficulty: "easy" },
      { text: "¿Qué significa 'Jamboree' en el contexto scout?", optionA: "Un gran encuentro internacional de scouts", optionB: "Un tipo de campamento de supervivencia", optionC: "El campamento de fin de año de una tropa", optionD: "Una competencia de habilidades scout", correctOption: "A", difficulty: "medium" },
      { text: "¿Cuál es el saludo scout oficial?", optionA: "Con tres dedos extendidos de la mano derecha", optionB: "Con dos dedos extendidos de la mano derecha", optionC: "Con la mano abierta sobre el corazón", optionD: "Con el puño cerrado en alto", correctOption: "A", difficulty: "easy" },
      { text: "¿Qué libro escribió Baden-Powell como manual para los scouts?", optionA: "Escultismo para muchachos", optionB: "El arte de la supervivencia", optionC: "Guía del explorador", optionD: "Manual del buen ciudadano", correctOption: "A", difficulty: "medium" },
    ],
  },
];

async function main() {
  console.log("Iniciando seed...");

  for (const cat of DATA) {
    // Upsert categoría
    const category = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: { name: cat.name, icon: cat.icon, isSystem: true },
    });

    // Buscar o crear banco del sistema para esta categoría
    let bank = await prisma.questionBank.findFirst({
      where: { name: `${cat.name} — Sistema`, isSystem: true },
    });

    if (!bank) {
      bank = await prisma.questionBank.create({
        data: {
          name: `${cat.name} — Sistema`,
          description: cat.bankDescription,
          isSystem: true,
        },
      });
    }

    // Solo agregar preguntas si el banco está vacío (idempotente)
    const existingCount = await prisma.bankQuestion.count({
      where: { questionBankId: bank.id },
    });

    if (existingCount > 0) {
      console.log(`  ↳ ${cat.name}: ya tiene ${existingCount} preguntas, omitiendo.`);
      continue;
    }

    // Crear preguntas y vincularlas al banco
    for (let i = 0; i < cat.questions.length; i++) {
      const q = cat.questions[i];
      const question = await prisma.question.create({
        data: {
          text: q.text,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correctOption: q.correctOption,
          difficulty: q.difficulty,
          categoryId: category.id,
          aiGenerated: false,
        },
      });

      await prisma.bankQuestion.create({
        data: {
          questionBankId: bank.id,
          questionId: question.id,
          order: i,
        },
      });
    }

    console.log(`  ✓ ${cat.name}: ${cat.questions.length} preguntas creadas.`);
  }

  console.log("Seed completado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
