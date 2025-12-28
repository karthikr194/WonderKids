import { LogicQuestion } from '../types';

const LOGIC_DATA = [
    // Level 1 (Toddler/Preschool)
    {
        level: 1,
        questions: [
            {
                question: "Which animal says 'Meow'?",
                options: ["Dog", "Cat", "Cow"],
                correctAnswer: "Cat",
                explanation: "Cats say Meow!"
            },
            {
                question: "Which one is a fruit?",
                options: ["Car", "Apple", "Ball"],
                correctAnswer: "Apple",
                explanation: "An apple is a yummy fruit."
            },
            {
                question: "What color is the sky usually?",
                options: ["Blue", "Green", "Purple"],
                correctAnswer: "Blue",
                explanation: "Look up! The sky is blue."
            },
             {
                question: "Which is biggest?",
                options: ["Ant", "Mouse", "Elephant"],
                correctAnswer: "Elephant",
                explanation: "Elephants are huge!"
            },
            {
                question: "What do you use to eat soup?",
                options: ["Fork", "Spoon", "Knife"],
                correctAnswer: "Spoon",
                explanation: "A spoon scoops up the soup."
            }
        ]
    },
    // Level 2 (Kindergarten)
    {
        level: 2,
        questions: [
            {
                question: "Which shape has 3 sides?",
                options: ["Square", "Circle", "Triangle"],
                correctAnswer: "Triangle",
                explanation: "Triangles have 3 sides."
            },
            {
                question: "If you have 2 apples and get 1 more, how many do you have?",
                options: ["2", "3", "4"],
                correctAnswer: "3",
                explanation: "2 plus 1 makes 3."
            },
            {
                question: "What do you wear on your feet?",
                options: ["Hat", "Shoes", "Gloves"],
                correctAnswer: "Shoes",
                explanation: "Shoes go on your feet to walk."
            },
            {
                question: "Which does not belong?",
                options: ["Car", "Bus", "Banana"],
                correctAnswer: "Banana",
                explanation: "A banana is food, the others are vehicles."
            },
            {
                question: "What comes next: Red, Blue, Red, ...?",
                options: ["Green", "Blue", "Yellow"],
                correctAnswer: "Blue",
                explanation: "It's a pattern: Red, Blue, Red, Blue!"
            }
        ]
    },
    // Level 3+ (Early Elementary)
    {
        level: 3,
        questions: [
             {
                question: "10, 20, 30, ... What comes next?",
                options: ["35", "40", "50"],
                correctAnswer: "40",
                explanation: "We are counting by tens: 10, 20, 30, 40."
            },
            {
                question: "Ice is cold, Fire is ...?",
                options: ["Wet", "Hot", "Blue"],
                correctAnswer: "Hot",
                explanation: "Fire is the opposite of ice, so it is hot."
            },
            {
                question: "Which is a solid?",
                options: ["Water", "Rock", "Air"],
                correctAnswer: "Rock",
                explanation: "A rock is hard and solid."
            },
             {
                question: "If yesterday was Monday, what is today?",
                options: ["Sunday", "Tuesday", "Wednesday"],
                correctAnswer: "Tuesday",
                explanation: "Tuesday comes after Monday."
            },
            {
                question: "What do plants need to grow?",
                options: ["Candy", "Sunlight", "Toys"],
                correctAnswer: "Sunlight",
                explanation: "Plants need sunlight and water to grow."
            }
        ]
    }
];

const ENCOURAGEMENTS = ["Awesome!", "Great Job!", "You're a Star!", "Fantastic!", "Super Smart!", "Way to go!", "Brilliant!"];
const GENTLE_PROMPTS = ["Try again!", "Give it another go!", "Oops, almost!", "Keep trying!", "You can do it!"];

export const generateLogicQuestion = async (age: number, level: number = 1): Promise<LogicQuestion | null> => {
    // Simulate async to keep component logic consistent
    await new Promise(resolve => setTimeout(resolve, 600));

    // Determine difficulty bucket based on level
    let bucketLevel = 1;
    if (level >= 3 && level < 6) bucketLevel = 2;
    if (level >= 6) bucketLevel = 3;

    // Use bucket level to find data, default to level 1 if something goes wrong
    const category = LOGIC_DATA.find(d => d.level === bucketLevel) || LOGIC_DATA[0];
    
    // Pick random question
    const q = category.questions[Math.floor(Math.random() * category.questions.length)];

    return JSON.parse(JSON.stringify(q));
};

export const getEncouragement = async (name: string, success: boolean): Promise<string> => {
    // Return instant response
    const list = success ? ENCOURAGEMENTS : GENTLE_PROMPTS;
    return list[Math.floor(Math.random() * list.length)];
};
