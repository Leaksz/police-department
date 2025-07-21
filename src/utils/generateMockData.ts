import { v4 as uuidv4 } from "uuid";
import { Agent, AgentRole } from "types/agent.types";

function generateRandomDate(): string {
    const start = new Date(2007, 0, 1);
    const end = new Date(2024, 11, 31);
    const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    const date = new Date(randomTime);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}/${month}/${day}`;
}

function getRandomRole(roles: AgentRole[], roleWeights: number[]): AgentRole {
    const random = Math.random();
    let cumulativeWeight = 0;

    for (let i = 0; i < roles.length; i++) {
        cumulativeWeight += roleWeights[i];
        if (random <= cumulativeWeight) {
            return roles[i];
        }
    }

    return AgentRole.Officer;
}

export function generateAgents(amount: number): Agent[] {
    const firstNames = [
        "James",
        "Mary",
        "John",
        "Patricia",
        "Robert",
        "Jennifer",
        "Michael",
        "Linda",
        "William",
        "Elizabeth",
        "David",
        "Barbara",
        "Richard",
        "Susan",
        "Joseph",
        "Jessica",
        "Thomas",
        "Sarah",
        "Christopher",
        "Karen",
        "Charles",
        "Nancy",
        "Daniel",
        "Lisa",
        "Matthew",
        "Betty",
        "Anthony",
        "Helen",
        "Mark",
        "Sandra",
        "Donald",
        "Donna",
        "Steven",
        "Carol",
        "Paul",
        "Ruth",
        "Andrew",
        "Sharon",
        "Joshua",
        "Michelle",
        "Kenneth",
        "Laura",
        "Kevin",
        "Sarah",
        "Brian",
        "Kimberly",
        "George",
        "Deborah",
        "Edward",
        "Dorothy",
        "Ronald",
        "Amy",
        "Timothy",
        "Angela",
        "Jason",
        "Ashley",
        "Jeffrey",
        "Brenda",
        "Ryan",
        "Emma",
        "Jacob",
        "Olivia",
        "Gary",
        "Cynthia",
        "Nicholas",
        "Marie",
        "Eric",
        "Janet",
        "Jonathan",
        "Catherine",
        "Stephen",
        "Frances",
        "Larry",
        "Christine",
        "Justin",
        "Samantha",
        "Scott",
        "Debra",
        "Brandon",
        "Rachel",
        "Benjamin",
        "Carolyn",
        "Samuel",
        "Janet",
        "Gregory",
        "Virginia",
        "Alexander",
        "Maria",
        "Frank",
        "Heather",
        "Raymond",
        "Diane",
        "Jack",
        "Julie",
        "Dennis",
        "Joyce",
        "Jerry",
        "Victoria",
        "Tyler",
        "Kelly",
        "Aaron",
        "Christina",
        "Jose",
        "Joan",
        "Henry",
        "Evelyn",
        "Adam",
        "Lauren",
        "Douglas",
        "Judith",
        "Nathan",
        "Megan",
        "Peter",
        "Cheryl",
        "Zachary",
        "Andrea",
        "Kyle",
        "Hannah",
        "Walter",
        "Jacqueline",
        "Harold",
        "Martha",
        "Carl",
        "Gloria",
        "Jeremy",
        "Teresa",
        "Arthur",
        "Sara",
    ];

    const lastNames = [
        "Smith",
        "Johnson",
        "Williams",
        "Brown",
        "Jones",
        "Garcia",
        "Miller",
        "Davis",
        "Rodriguez",
        "Martinez",
        "Hernandez",
        "Lopez",
        "Gonzalez",
        "Wilson",
        "Anderson",
        "Thomas",
        "Taylor",
        "Moore",
        "Jackson",
        "Martin",
        "Lee",
        "Perez",
        "Thompson",
        "White",
        "Harris",
        "Sanchez",
        "Clark",
        "Ramirez",
        "Lewis",
        "Robinson",
        "Walker",
        "Young",
        "Allen",
        "King",
        "Wright",
        "Scott",
        "Torres",
        "Nguyen",
        "Hill",
        "Flores",
        "Green",
        "Adams",
        "Nelson",
        "Baker",
        "Hall",
        "Rivera",
        "Campbell",
        "Mitchell",
        "Carter",
        "Roberts",
        "Gomez",
        "Phillips",
        "Evans",
        "Turner",
        "Diaz",
        "Parker",
        "Cruz",
        "Edwards",
        "Collins",
        "Reyes",
        "Stewart",
        "Morris",
        "Morales",
        "Murphy",
        "Cook",
        "Rogers",
        "Gutierrez",
        "Ortiz",
        "Morgan",
        "Cooper",
        "Peterson",
        "Bailey",
        "Reed",
        "Kelly",
        "Howard",
        "Ramos",
        "Kim",
        "Cox",
        "Ward",
        "Richardson",
        "Watson",
        "Brooks",
        "Chavez",
        "Wood",
        "James",
        "Bennett",
        "Gray",
        "Mendoza",
        "Ruiz",
        "Hughes",
        "Price",
        "Alvarez",
        "Castillo",
        "Sanders",
        "Patel",
        "Myers",
        "Long",
        "Ross",
        "Foster",
        "Jimenez",
        "Powell",
        "Jenkins",
        "Perry",
        "Russell",
        "Sullivan",
        "Bell",
        "Coleman",
        "Butler",
        "Henderson",
        "Barnes",
        "Gonzales",
        "Fisher",
        "Vasquez",
        "Simmons",
        "Romero",
        "Jordan",
        "Patterson",
        "Alexander",
        "Hamilton",
        "Graham",
    ];

    const roles = [AgentRole.Officer, AgentRole.Detective, AgentRole.Captain, AgentRole.Chief];
    const roleWeights = [0.6, 0.3, 0.08, 0.02];

    const agents: Agent[] = [];
    const usedNames = new Set<string>();

    for (let i = 0; i <= amount + 1; i++) {
        let firstName: string;
        let lastName: string;
        let fullName: string;

        // Ensure unique names
        do {
            firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            fullName = `${firstName} ${lastName}`;
        } while (usedNames.has(fullName));

        usedNames.add(fullName);

        const agent: Agent = {
            id: uuidv4(),
            name: fullName,
            role: getRandomRole(roles, roleWeights),
            incorporationDate: generateRandomDate(),
        };

        agents.push(agent);
    }

    return agents;
}
