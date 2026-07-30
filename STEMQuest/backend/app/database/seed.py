import asyncio
from app.models.course import Course, Chapter
from app.models.quiz import Quiz, Question

async def seed_data(force: bool = False):
    count = await Course.count()
    if count > 0 and not force:
        print(f"Database already has {count} courses. Skipping seed.")
        return

    if force and count > 0:
        print("Clearing existing courses for re-seeding...")
        await Course.delete_all()

    print("Seeding 15 rich STEMQuest courses & comprehensive topic details...")

    courses = [
        # 1. Python Programming
        Course(
            title="Introduction to Python Programming",
            description="Master fundamental Python programming concepts, data structures, control flow, functions, and object-oriented software engineering for STEM projects.",
            instructor_id="admin",
            thumbnail="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
            level="beginner",
            category="Programming",
            tags=["Python", "Coding", "Software", "STEM"],
            duration="4 Hours",
            rating=4.9,
            enrolled_count=42,
            is_published=True,
            chapters=[
                Chapter(
                    title="Chapter 1: Python Syntax, Variables & Dynamic Data Types",
                    description="Learn core syntax rules, dynamic memory allocation, primitive types, strings, numbers, and print formatting.",
                    content="""📌 OVERVIEW & CORE CONCEPTS:
Python is an interpreted, high-level, general-purpose programming language renowned for clear syntax and readability.

🔹 1. Variables & Memory Allocation
In Python, variables are created when you assign a value using the assignment operator (=). Types are dynamic.
• Primitive Types:
  - Integer (int): e.g. age = 22
  - Floating point (float): e.g. pi = 3.14159
  - String (str): e.g. name = "STEMQuest"
  - Boolean (bool): e.g. is_completed = True

🔹 2. String Formatting & Output
Modern Python uses f-strings for string interpolation:
```python
user_name = "Rutuja"
points = 1250
print(f"Student {user_name} achieved {points} points!")
```

🔹 3. Key Naming Conventions:
Always use snake_case for functions and variables, and PascalCase for class names. Indentation (4 spaces) defines code blocks.""",
                    order=1
                ),
                Chapter(
                    title="Chapter 2: Control Flow, Loops & Data Structures",
                    description="Master conditional statements, for/while iteration, lists, tuples, dictionaries, and set operations.",
                    content="""📌 OVERVIEW & CORE CONCEPTS:
Data structures allow efficient storage and organization of data, while control flow directs program execution.

🔹 1. Conditional Branching:
```python
score = 85
if score >= 90:
    print("Grade A+")
elif score >= 75:
    print("Grade A")
else:
    print("Keep Practicing!")
```

🔹 2. Data Structures Breakdown:
• Lists (Mutable, Ordered):
  topics = ["Python", "Math", "Physics"]
  topics.append("Chemistry")

• Dictionaries (Key-Value Mapping):
  student = {"id": 101, "name": "Rutuja", "gpa": 3.9}
  print(student["name"])

• Tuples (Immutable):
  coordinates = (19.0760, 72.8777)""",
                    order=2
                ),
                Chapter(
                    title="Chapter 3: Functions, Modules & Object-Oriented Design",
                    description="Write modular reusable functions, manage scopes, import external packages, and construct custom OOP classes.",
                    content="""📌 OVERVIEW & CORE CONCEPTS:
Object-Oriented Programming (OOP) groups attributes and behaviors into reusable classes and objects.

🔹 1. Defining Reusable Functions:
```python
def calculate_area(radius: float) -> float:
    \"\"\"Calculates the area of a circle given radius.\"\"\"
    import math
    return math.pi * (radius ** 2)
```

🔹 2. Building Classes & Objects:
```python
class Learner:
    def __init__(self, name: str, role: str = "Student"):
        self.name = name
        self.role = role
        self.completed_courses = []

    def enroll(self, course_title: str):
        self.completed_courses.append(course_title)
        return f"{self.name} enrolled in {course_title}!"
```""",
                    order=3
                )
            ]
        ),

        # 2. Mathematics
        Course(
            title="Essential Mathematics for Science & Engineering",
            description="Master differential calculus, linear algebra, vector fields, and probability concepts required for physics, engineering, and artificial intelligence.",
            instructor_id="admin",
            thumbnail="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80",
            level="intermediate",
            category="Mathematics",
            tags=["Math", "Calculus", "Algebra", "Engineering"],
            duration="6 Hours",
            rating=4.9,
            enrolled_count=35,
            is_published=True,
            chapters=[
                Chapter(
                    title="Chapter 1: Differential & Integral Calculus Fundamentals",
                    description="Derivatives, rates of change, integrals, area under curves, and real-world optimization problems.",
                    content="""📌 OVERVIEW & FORMULAS:
Calculus is the mathematical study of continuous change, divided into differential and integral calculus.

🔹 1. Differential Calculus (Rates of Change):
The derivative f'(x) measures the instantaneous rate of change of a function:
$$f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$
• Power Rule: d/dx(x^n) = n * x^(n-1)
• Product Rule: d/dx(u * v) = u'v + uv'
• Chain Rule: d/dx(f(g(x))) = f'(g(x)) * g'(x)

🔹 2. Integral Calculus (Accumulation):
Integration calculates the cumulative area bounded under a curve:
$$\\int_{a}^{b} f(x) dx = F(b) - F(a)$$

🔹 3. Practical Applications:
Calculating velocity from position vectors: v(t) = ds/dt, and acceleration: a(t) = dv/dt.""",
                    order=1
                ),
                Chapter(
                    title="Chapter 2: Matrices, Vectors & Linear Transformations",
                    description="Vectors, matrix multiplication, determinants, eigenvalues, eigenvectors, and dimensionality reduction.",
                    content="""📌 OVERVIEW & MATRIX ALGEBRA:
Linear algebra provides the mathematical language for multi-dimensional data transformation, computer graphics, and machine learning.

🔹 1. Vector Operations & Dot Product:
Vector A = [a1, a2], Vector B = [b1, b2].
Dot Product: A • B = a1*b1 + a2*b2 = ||A|| ||B|| cos(theta)

🔹 2. Matrix Multiplication Rules:
Product of Matrix A (m x n) and Matrix B (n x p) yields Matrix C (m x p).

🔹 3. Eigenvalues & Eigenvectors:
An eigenvector v of matrix A is a non-zero vector that changes by a scalar factor lambda when linear transformation A is applied:
$$A v = \\lambda v$$
Applications: PageRank algorithms, structural vibration analysis, and Principal Component Analysis (PCA).""",
                    order=2
                )
            ]
        ),

        # 3. Physics
        Course(
            title="Physics: Mechanics, Motion & Waves",
            description="Explore Newton's laws of motion, kinetic & potential energy conservation, momentum, fluid dynamics, and wave mechanics through practical simulations.",
            instructor_id="admin",
            thumbnail="https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80",
            level="beginner",
            category="Physics",
            tags=["Physics", "Mechanics", "Waves", "Energy"],
            duration="5 Hours",
            rating=4.8,
            enrolled_count=28,
            is_published=True,
            chapters=[
                Chapter(
                    title="Chapter 1: Newtonian Mechanics & Laws of Motion",
                    description="Understand inertia, Force = Mass x Acceleration, impulse, friction, and Newton's three fundamental laws.",
                    content="""📌 OVERVIEW & FUNDAMENTAL LAWS:
Classical mechanics describes the motion of macroscopic objects from projectiles to planetary bodies.

🔹 1. Newton's Three Laws:
• First Law (Inertia): An object remains at rest or in uniform straight-line motion unless acted upon by a net external force.
• Second Law (F = ma): The acceleration of an object is directly proportional to net force and inversely proportional to mass.
• Third Law: For every action force, there is an equal and opposite reaction force.

🔹 2. Equations of Kinematics:
1. v = u + a * t
2. s = u * t + 0.5 * a * t^2
3. v^2 = u^2 + 2 * a * s""",
                    order=1
                ),
                Chapter(
                    title="Chapter 2: Energy Conservation, Work & Mechanical Waves",
                    description="Work-energy theorem, gravitational potential energy, kinetic energy, wave frequency, amplitude, and resonance.",
                    content="""📌 OVERVIEW & WAVE MECHANICS:
Energy cannot be created or destroyed; it only transforms from one form to another.

🔹 1. Work & Energy Formulas:
• Mechanical Work: W = F * d * cos(theta) (Joules)
• Kinetic Energy: KE = 0.5 * m * v^2
• Gravitational Potential Energy: PE = m * g * h

🔹 2. Wave Equation & Properties:
Wave speed v is given by frequency f and wavelength lambda:
$$v = f \\times \\lambda$$
Simple harmonic motion (SHM) governs pendulums, acoustics, and optical waves.""",
                    order=2
                )
            ]
        ),

        # 4. Chemistry
        Course(
            title="Organic & Physical Chemistry Foundations",
            description="Explore atomic structure, chemical bonding, organic reaction mechanisms, stoichiometry, chemical equilibrium, and thermodynamics.",
            instructor_id="admin",
            thumbnail="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80",
            level="intermediate",
            category="Chemistry",
            tags=["Chemistry", "Molecules", "Reactions", "Organic"],
            duration="6 Hours",
            rating=4.7,
            enrolled_count=20,
            is_published=True,
            chapters=[
                Chapter(
                    title="Chapter 1: Atomic Structure, Quantum Orbitals & Chemical Bonding",
                    description="Subatomic particles, electron configuration, ionic vs covalent bonding, and molecular orbital theory.",
                    content="""📌 OVERVIEW & ATOMIC THEORY:
Chemistry studies matter, its properties, how substances combine or separate to form other substances, and how substances interact with energy.

🔹 1. Quantum Atomic Model:
Electrons occupy specific energy subshells (s, p, d, f) according to:
• Pauli Exclusion Principle: Max 2 electrons per orbital with opposite spins.
• Aufbau Principle: Electrons fill lowest energy orbitals first.

🔹 2. Chemical Bonds:
• Ionic Bonding: Transfer of electrons creating charged ions (e.g. NaCl).
• Covalent Bonding: Sharing of electron pairs between non-metals (e.g. H2O, CH4).""",
                    order=1
                ),
                Chapter(
                    title="Chapter 2: Organic Functional Groups & Reaction Mechanisms",
                    description="Alkanes, alkenes, alcohols, carboxylic acids, nucleophilic substitution (SN1/SN2), and electrophilic addition.",
                    content="""📌 OVERVIEW & ORGANIC SYNTHESIS:
Organic chemistry focuses on carbon compounds that form the basis of life and synthetic materials.

🔹 1. Key Functional Groups:
• Hydroxyl (-OH): Alcohols (e.g. Ethanol)
• Carbonyl (C=O): Aldehydes and Ketones
• Carboxyl (-COOH): Carboxylic acids (e.g. Acetic acid)
• Amino (-NH2): Amines & Amino Acids

🔹 2. Substitution Mechanisms:
• SN1 Reaction: Two-step mechanism involving a carbocation intermediate.
• SN2 Reaction: One-step concerted bimolecular substitution with inversion of configuration.""",
                    order=2
                )
            ]
        ),

        # 5. Biology
        Course(
            title="Cell Biology & Molecular Genetics",
            description="Uncover the secrets of living cells, DNA replication, gene expression, RNA translation, protein folding, and inheritance patterns.",
            instructor_id="admin",
            thumbnail="https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=800&q=80",
            level="beginner",
            category="Biology",
            tags=["Biology", "Genetics", "DNA", "Cellular"],
            duration="5 Hours",
            rating=4.8,
            enrolled_count=30,
            is_published=True,
            chapters=[
                Chapter(
                    title="Chapter 1: Cellular Architecture & Organelles",
                    description="Prokaryotes vs eukaryotes, cell membrane transport, mitochondria, and ATP energy synthesis.",
                    content="""📌 OVERVIEW & CELLULAR STRUCTURE:
The cell is the basic structural, functional, and biological unit of all known organisms.

🔹 1. Organelle Functions:
• Nucleus: Contains genomic DNA and controls cellular activities.
• Mitochondria: Synthesizes ATP via cellular respiration and oxidative phosphorylation.
• Endoplasmic Reticulum: Rough ER handles protein translation; Smooth ER handles lipid synthesis.

🔹 2. Membrane Transport:
• Passive Diffusion: Movement down concentration gradient without ATP.
• Active Transport: Uses ATP to move molecules against concentration gradient (e.g., Na+/K+ pump).""",
                    order=1
                ),
                Chapter(
                    title="Chapter 2: DNA Replication, Transcription & Translation",
                    description="The central dogma of molecular biology: DNA -> mRNA -> Amino Acids -> Protein structure.",
                    content="""📌 THE CENTRAL DOGMA OF BIOLOGY:
Genetic information encoded in DNA is transcribed into RNA and translated into functional protein enzymes.

🔹 1. DNA Double Helix:
Composed of nucleotides: Adenine (A), Thymine (T), Cytosine (C), and Guanine (G). Base pairing rules: A-T and C-G.

🔹 2. Transcription & Translation Steps:
1. Transcription: RNA Polymerase synthesizes mRNA from DNA template in the nucleus.
2. Translation: Ribosomes read 3-letter mRNA codons (e.g. AUG) and tRNA brings matching amino acids to build polypeptide chains.""",
                    order=2
                )
            ]
        ),

        # 6. Data Science
        Course(
            title="Data Science & Machine Learning Foundations",
            description="Learn data wrangling with Pandas, statistical visualization with Seaborn, and build predictive machine learning models with Scikit-Learn.",
            instructor_id="admin",
            thumbnail="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
            level="advanced",
            category="Programming",
            tags=["Data Science", "Machine Learning", "AI", "Analytics"],
            duration="7 Hours",
            rating=4.9,
            enrolled_count=50,
            is_published=True,
            chapters=[
                Chapter(
                    title="Chapter 1: Data Wrangling with Pandas & NumPy",
                    description="DataFrames, numerical arrays, cleaning missing values, filtering rows, and aggregation operations.",
                    content="""📌 OVERVIEW & DATA MANIPULATION:
Data preparation constitutes up to 80% of data science projects.

🔹 1. NumPy Multi-Dimensional Arrays:
Vectorized array computations executed in C for maximum speed:
```python
import numpy as np
arr = np.array([1, 2, 3, 4, 5])
mean_val = np.mean(arr)
```

🔹 2. Pandas DataFrames:
```python
import pandas as pd
df = pd.read_csv("students.csv")
df_clean = df.dropna().filter(items=["name", "score"])
high_scorers = df_clean[df_clean["score"] > 80]
```""",
                    order=1
                ),
                Chapter(
                    title="Chapter 2: Supervised Machine Learning Algorithms",
                    description="Linear & Logistic Regression, Decision Trees, Random Forests, and Model Validation Metrics.",
                    content="""📌 OVERVIEW & PREDICTIVE MODELING:
Supervised learning uses labeled training datasets to infer a mathematical mapping function.

🔹 1. Classification vs Regression:
• Regression: Predicts continuous continuous numeric values (e.g. House Prices).
• Classification: Predicts discrete categorical class labels (e.g. Spam / Not Spam).

🔹 2. Building Models in Scikit-Learn:
```python
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)
acc = model.score(X_test, y_test)
print(f"Model Accuracy: {acc * 100:.2f}%")
```""",
                    order=2
                )
            ]
        ),

        # 7. Robotics
        Course(
            title="Robotics & Embedded Systems Engineering",
            description="Design smart electronic systems, program microcontrollers (Arduino & ESP32), interface sensor modules, and construct robotic actuators.",
            instructor_id="admin",
            thumbnail="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
            level="intermediate",
            category="Engineering",
            tags=["Robotics", "Arduino", "Engineering", "IoT"],
            duration="6 Hours",
            rating=4.8,
            enrolled_count=24,
            is_published=True,
            chapters=[
                Chapter(
                    title="Chapter 1: Microcontrollers & Circuit Fundamentals",
                    description="Resistors, transistors, microcontrollers, digital I/O pins, and pulse-width modulation (PWM).",
                    content="""📌 OVERVIEW & HARDWARE CONCEPTS:
Robotics combines mechanical engineering, electrical engineering, and computer science.

🔹 1. Ohm's Law & Circuit Analysis:
Voltage (V) = Current (I) * Resistance (R). Power (P) = V * I.

🔹 2. Microcontroller Pin Architecture:
• Digital I/O Pins: HIGH (5V/3.3V) or LOW (0V).
• Analog Read Pins: 10-bit ADC converting 0-5V to numeric range 0-1023.
• PWM (Pulse-Width Modulation): Simulates analog output by rapidly pulsing digital signal duty cycles.""",
                    order=1
                ),
                Chapter(
                    title="Chapter 2: Sensor Interfacing & Motor Controls",
                    description="Ultrasonic sonar sensors, infrared encoders, DC motor drivers (H-Bridge L298N), and servo control.",
                    content="""📌 SENSORS & ACTUATORS:
Robots perceive their environment using sensors and act using motors.

🔹 1. Sensor Integration:
Ultrasonic HC-SR04 measures distance by emitting a 40kHz acoustic pulse and calculating echo time delay:
$$Distance = \\frac{Time \\times Speed\\ of\\ Sound}{2}$$

🔹 2. H-Bridge Motor Drivers (L298N):
Enables bidirectional DC motor speed and directional rotation control via microcontroller PWM output.""",
                    order=2
                )
            ]
        ),

        # 8. Astronomy
        Course(
            title="Space Science, Astronomy & Astrophysics",
            description="Embark on a journey through the cosmos exploring planetary orbits, stellar lifecycles, supernovae, black holes, exoplanets, and observational cosmology.",
            instructor_id="admin",
            thumbnail="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
            level="beginner",
            category="Physics",
            tags=["Space", "Astronomy", "Astrophysics", "Cosmology"],
            duration="5 Hours",
            rating=4.9,
            enrolled_count=38,
            is_published=True,
            chapters=[
                Chapter(
                    title="Chapter 1: Celestial Mechanics & Gravitational Orbits",
                    description="Kepler's laws of planetary motion, Newton's universal gravitation, and satellite orbital mechanics.",
                    content="""📌 OVERVIEW & ORBITAL LAWS:
Astronomy investigates celestial bodies and cosmic physical phenomena.

🔹 1. Kepler's Three Laws of Planetary Motion:
1. Elliptical Orbits: Planetary orbits are ellipses with the Sun at one focus.
2. Equal Area Law: A line connecting a planet and the Sun sweeps out equal areas in equal time intervals.
3. Harmonic Law: The square of orbital period T is proportional to the cube of semi-major axis a (T^2 = a^3).

🔹 2. Orbital Escape Velocity Formula:
$$v_{esc} = \\sqrt{\\frac{2 G M}{R}}$$""",
                    order=1
                ),
                Chapter(
                    title="Chapter 2: Stellar Lifecycles, Supernovae & Black Holes",
                    description="Protostars, nuclear fusion in stellar cores, red giants, white dwarfs, neutron stars, and event horizons.",
                    content="""📌 STELLAR EVOLUTION:
Stars undergo evolutionary lifecycles governed by hydrostatic equilibrium between gravitational collapse and nuclear fusion pressure.

🔹 1. Main Sequence Fusion:
Protons fuse into Helium in stellar cores via the proton-proton chain, liberating vast electromagnetic radiation.

🔹 2. End States of Stellar Evolution:
• Low-Mass Stars (e.g. Sun) -> Red Giant -> Planetary Nebula -> White Dwarf.
• High-Mass Stars (> 8 Solar Masses) -> Supernova explosion -> Neutron Star or Black Hole (Event Horizon radius R_s = 2GM/c^2).""",
                    order=2
                )
            ]
        ),

        # 9. Web Development
        Course(
            title="Modern Web Development with React & Node.js",
            description="Build modern, scalable full-stack web applications with HTML5, CSS3, JavaScript ES6+, React components, RESTful APIs, and Node.js backends.",
            instructor_id="admin",
            thumbnail="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
            level="intermediate",
            category="Programming",
            tags=["Web Dev", "React", "Node", "JavaScript"],
            duration="6 Hours",
            rating=4.9,
            enrolled_count=45,
            is_published=True,
            chapters=[
                Chapter(
                    title="Chapter 1: Modern JavaScript ES6+ & Responsive DOM Design",
                    description="Arrow functions, destructuring, promises, async/await, fetch API, and responsive flexbox/grid layouts.",
                    content="""📌 OVERVIEW & FRONTEND CORE:
Web development powers modern interactive software applications across browsers.

🔹 1. Asynchronous JavaScript (Promises & Async/Await):
```javascript
const fetchCourseData = async () => {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/courses/");
        const data = await response.json();
        console.log("Loaded Courses:", data);
    } catch (err) {
        console.error("Fetch Error:", err);
    }
};
```""",
                    order=1
                ),
                Chapter(
                    title="Chapter 2: React Component Architecture & Hooks State Management",
                    description="JSX syntax, functional components, useState, useEffect, context API, and SPA routing.",
                    content="""📌 REACT CORE ARCHITECTURE:
React uses a virtual DOM to declaratively update web user interfaces efficiently.

🔹 1. Component State & Hooks:
```jsx
import React, { useState, useEffect } from 'react';

const CourseCounter = () => {
    const [count, setCount] = useState(0);
    return (
        <button onClick={() => setCount(count + 1)}>
            Completed Lessons: {count}
        </button>
    );
};
```""",
                    order=2
                )
            ]
        ),

        # 10. Artificial Intelligence & Deep Learning
        Course(
            title="Artificial Intelligence & Deep Neural Networks",
            description="Explore artificial neural networks, backpropagation algorithms, convolutional neural networks (CNNs), and natural language processing (NLP).",
            instructor_id="admin",
            thumbnail="https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80",
            level="advanced",
            category="Programming",
            tags=["AI", "Deep Learning", "Neural Networks", "Python"],
            duration="8 Hours",
            rating=4.95,
            enrolled_count=60,
            is_published=True,
            chapters=[
                Chapter(
                    title="Chapter 1: Artificial Neurons, Perceptrons & Activation Functions",
                    description="Biological vs artificial neurons, linear combinations, weight bias tuning, ReLU, Sigmoid, and Softmax functions.",
                    content="""📌 OVERVIEW & NEURAL ARCHITECTURE:
Deep learning imitates human brain neural structures using multi-layered node networks.

🔹 1. Artificial Perceptron Formula:
Output y is computed by applying activation function sigma to weighted input sum plus bias:
$$y = \\sigma \\left( \\sum_{i=1}^{n} w_i x_i + b \\right)$$

🔹 2. Activation Functions:
• Sigmoid: Maps outputs to range (0, 1) for probabilities.
• ReLU (Rectified Linear Unit): f(x) = max(0, x), preventing vanishing gradient problems.""",
                    order=1
                ),
                Chapter(
                    title="Chapter 2: Convolutional Neural Networks (CNNs) & Computer Vision",
                    description="Convolutional layers, pooling filters, feature maps, image classification, and object detection.",
                    content="""📌 COMPUTER VISION & CNNS:
CNNs utilize spatial feature extraction matrices to inspect digital images.

🔹 1. CNN Architecture Layers:
1. Convolutional Layer: Applies filter kernels to extract edges, textures, and features.
2. Pooling Layer (Max Pooling): Reduces spatial dimension while retaining salient features.
3. Fully Connected Dense Layer: Performs final class label predictions.""",
                    order=2
                )
            ]
        ),

        # 11. Cybersecurity
        Course(
            title="Cybersecurity, Cryptography & Network Defense",
            description="Learn ethical hacking, asymmetric encryption (RSA & ECC), network packet analysis, vulnerability assessment, and defense protocols.",
            instructor_id="admin",
            thumbnail="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
            level="intermediate",
            category="Programming",
            tags=["Cybersecurity", "Encryption", "Networks", "Security"],
            duration="6 Hours",
            rating=4.85,
            enrolled_count=32,
            is_published=True,
            chapters=[
                Chapter(
                    title="Chapter 1: Principles of Network Security & Threats",
                    description="OSI layer security, Man-in-the-Middle (MitM) attacks, SQL injection, cross-site scripting (XSS), and firewalls.",
                    content="""📌 OVERVIEW & SECURITY TRIAD:
Cybersecurity protects computer systems, networks, and data from unauthorized digital attacks.

🔹 1. CIA Security Triad:
• Confidentiality: Ensuring sensitive data remains accessible only to authorized parties.
• Integrity: Safeguarding data against unauthorized alteration.
• Availability: Ensuring reliable timely access to data and systems.

🔹 2. Common Vulnerabilities:
• SQL Injection (SQLi): Malicious SQL queries inserted into user input fields.
• Cross-Site Scripting (XSS): Injecting client-side scripts into viewed web pages.""",
                    order=1
                ),
                Chapter(
                    title="Chapter 2: Cryptographic Hash Functions & Public Key Cryptography",
                    description="Symmetric AES encryption, RSA public/private key pairs, digital signatures, and TLS/SSL certificates.",
                    content="""📌 CRYPTOGRAPHY:
Mathematical algorithms that secure transmitted communication channels.

🔹 1. Symmetric vs Asymmetric Encryption:
• Symmetric Encryption (AES-256): Uses the same secret key for encryption and decryption.
• Asymmetric Encryption (RSA/ECC): Uses a public key to encrypt data and a private key to decrypt data.

🔹 2. Digital Signatures & Hashes (SHA-256):
One-way cryptographic hash functions generate unique fixed-length strings ensuring payload integrity.""",
                    order=2
                )
            ]
        ),

        # 12. Quantum Computing
        Course(
            title="Quantum Computing & Quantum Physics",
            description="Discover quantum superposition, entanglement, qubits, Hadamard gates, Shor's algorithm, and quantum circuit simulators.",
            instructor_id="admin",
            thumbnail="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80",
            level="advanced",
            category="Physics",
            tags=["Quantum", "Physics", "Qubits", "Advanced"],
            duration="7 Hours",
            rating=4.9,
            enrolled_count=19,
            is_published=True,
            chapters=[
                Chapter(
                    title="Chapter 1: Qubits & Quantum Superposition",
                    description="Classical bits vs quantum bits (qubits), Dirac bra-ket notation, and Bloch sphere representation.",
                    content="""📌 QUANTUM MECHANICS FUNDAMENTALS:
Quantum computing harnesses quantum state phenomena to solve complex computational problems exponentially faster than classical supercomputers.

🔹 1. Qubits & Superposition:
Unlike classical bits (0 or 1), a qubit exists in a linear combination state:
$$|\\psi\\rangle = \\alpha |0\\rangle + \\beta |1\\rangle$$
where |alpha|^2 + |beta|^2 = 1.

🔹 2. Bloch Sphere Geometry:
Geometrical representation of pure qubit quantum states on the surface of a unit sphere.""",
                    order=1
                ),
                Chapter(
                    title="Chapter 2: Quantum Entanglement & Quantum Gates",
                    description="Bell states, Hadamard gate, Pauli-X/Y/Z gates, CNOT gate, and quantum algorithm execution.",
                    content="""📌 QUANTUM CIRCUITS & ENTANGLEMENT:
Quantum entanglement links multiple qubits such that the state of one instantly dictates the state of another regardless of physical distance.

🔹 1. Fundamental Quantum Gates:
• Hadamard (H) Gate: Creates equal superposition states from basis state |0>.
• Pauli-X Gate: Quantum bit-flip operator (quantum NOT gate).
• CNOT Gate: Entangles two qubits (control & target).""",
                    order=2
                )
            ]
        ),

        # 13. Biochemistry
        Course(
            title="Biochemistry, Enzymes & Molecular Biology",
            description="Explore protein structures, enzyme kinetics (Michaelis-Menten), metabolic pathways (Glycolysis & Krebs Cycle), and biomolecular thermodynamics.",
            instructor_id="admin",
            thumbnail="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80",
            level="intermediate",
            category="Chemistry",
            tags=["Biochemistry", "Enzymes", "Biology", "Metabolism"],
            duration="6 Hours",
            rating=4.8,
            enrolled_count=22,
            is_published=True,
            chapters=[
                Chapter(
                    title="Chapter 1: Amino Acids & Protein Structure Hierarchy",
                    description="Primary, secondary (alpha-helix, beta-sheet), tertiary, and quaternary protein structures.",
                    content="""📌 PROTEIN BIOCHEMISTRY:
Proteins are biological macromolecules composed of 20 standard amino acid building blocks linked by peptide bonds.

🔹 1. Structural Levels:
1. Primary: Linear sequence of amino acids.
2. Secondary: Hydrogen-bonded alpha-helices and beta-pleated sheets.
3. Tertiary: 3D folding driven by hydrophobic interactions, ionic bonds, and disulfide bridges.
4. Quaternary: Complex assembly of multiple polypeptide subunits (e.g. Hemoglobin).""",
                    order=1
                ),
                Chapter(
                    title="Chapter 2: Enzyme Kinetics & Cellular Respiration Pathways",
                    description="Enzyme active sites, Michaelis-Menten kinetics (Vmax, Km), Glycolysis, and ATP synthesis.",
                    content="""📌 METABOLISM & ENZYMES:
Enzymes act as biological catalysts lowering activation energy for biochemical reactions.

🔹 1. Michaelis-Menten Kinetic Model:
$$v = \\frac{V_{max} [S]}{K_m + [S]}$$
where Km is the substrate concentration at which reaction rate is half of Vmax.

🔹 2. Glycolysis Pathway:
Converts 1 molecule of Glucose (6C) into 2 Pyruvate molecules (3C), yielding net 2 ATP and 2 NADH.""",
                    order=2
                )
            ]
        ),

        # 14. Environmental Science
        Course(
            title="Environmental Science, Climate Dynamics & Renewable Energy",
            description="Understand ecological balance, greenhouse gases, atmospheric thermodynamics, solar/wind clean energy tech, and environmental sustainability.",
            instructor_id="admin",
            thumbnail="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
            level="beginner",
            category="Biology",
            tags=["Environment", "Climate", "Energy", "Earth"],
            duration="5 Hours",
            rating=4.85,
            enrolled_count=36,
            is_published=True,
            chapters=[
                Chapter(
                    title="Chapter 1: Ecosystem Dynamics & Greenhouse Effect Mechanics",
                    description="Biogeochemical cycles, carbon sinks, global thermal radiation budget, and greenhouse warming mechanisms.",
                    content="""📌 ENVIRONMENTAL SYSTEMS:
Environmental science integrates physical, biological, and information sciences to study Earth's natural systems.

🔹 1. Greenhouse Radiation Balance:
Solar radiation passes through atmosphere; Earth re-emits infrared heat absorbed by greenhouse gases (CO2, CH4, H2O vapor), stabilizing global surface temperature.

🔹 2. Carbon Cycle & Biomes:
Photosynthesis sequesters CO2 into organic biomass, while respiration and fossil fuel combustion release CO2 back into the atmosphere.""",
                    order=1
                ),
                Chapter(
                    title="Chapter 2: Solar Photovoltaics & Clean Renewable Technologies",
                    description="Solar cell semiconductor physics, wind turbine dynamics, hydroelectric power, and grid energy storage.",
                    content="""📌 RENEWABLE ENERGY TECH:
Transitioning from fossil fuels to clean renewable energy sources.

🔹 1. Solar Photovoltaics (PV):
Semiconductor P-N junctions convert photon sunlight directly into direct current (DC) electricity via the photoelectric effect.

🔹 2. Wind Turbine Power Formula:
Power generated by wind turbines depends on air density rho, rotor swept area A, and wind speed v:
$$P = \\frac{1}{2} \\rho A v^3$$""",
                    order=2
                )
            ]
        ),

        # 15. Cloud Computing & DevOps
        Course(
            title="Cloud Computing, Microservices & DevOps",
            description="Architect cloud infrastructure on AWS, containerize applications with Docker & Kubernetes, build CI/CD pipelines, and scale microservices.",
            instructor_id="admin",
            thumbnail="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
            level="advanced",
            category="Engineering",
            tags=["Cloud", "DevOps", "Docker", "Kubernetes"],
            duration="7 Hours",
            rating=4.92,
            enrolled_count=55,
            is_published=True,
            chapters=[
                Chapter(
                    title="Chapter 1: Cloud Architecture, IaaS, PaaS & Serverless",
                    description="AWS/Azure cloud models, virtual private clouds (VPC), auto-scaling, load balancing, and serverless functions.",
                    content="""📌 CLOUD ARCHITECTURE:
Cloud computing delivers on-demand computing services over the internet with pay-as-you-go pricing.

🔹 1. Service Delivery Models:
• IaaS (Infrastructure as a Service): Raw compute VMs (AWS EC2).
• PaaS (Platform as a Service): Managed runtime environments (Heroku, AWS Elastic Beanstalk).
• SaaS (Software as a Service): End-user cloud applications (Google Drive).

🔹 2. Serverless Computing:
Event-driven stateless functions (AWS Lambda) that execute code without provisioning virtual servers.""",
                    order=1
                ),
                Chapter(
                    title="Chapter 2: Docker Containerization & Kubernetes Orchestration",
                    description="Dockerfile, images, container runtimes, Kubernetes pods, deployments, services, and CI/CD pipelines.",
                    content="""📌 CONTAINERIZATION & K8S:
Containers package software code along with all OS dependencies ensuring consistent execution across environments.

🔹 1. Dockerfile Example:
```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

🔹 2. Kubernetes Orchestration:
Automates deployment, scaling, load balancing, and self-healing of containerized applications across cluster nodes.""",
                    order=2
                )
            ]
        )
    ]

    for c in courses:
        await c.insert()

    print(f"Successfully seeded {len(courses)} STEMQuest courses with rich comprehensive topic details!")

    from app.models.user import User
    from app.services.auth_service import AuthService

    sample_users = [
        {"full_name": "Aarav Sharma", "email": "aarav@example.com", "points": 2850, "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"},
        {"full_name": "Priya Patel", "email": "priya@example.com", "points": 2420, "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"},
        {"full_name": "Rutuja Ubale", "email": "rutuja@example.com", "points": 1980, "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"},
        {"full_name": "Vikram Singh", "email": "vikram@example.com", "points": 1650, "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150"},
        {"full_name": "Ananya Roy", "email": "ananya@example.com", "points": 1420, "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150"},
        {"full_name": "Rohan Mehta", "email": "rohan@example.com", "points": 1200, "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"},
        {"full_name": "Neha Kulkarni", "email": "neha@example.com", "points": 950, "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"},
        {"full_name": "Siddharth Joshi", "email": "siddharth@example.com", "points": 810, "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"},
    ]

    for u_data in sample_users:
        existing = await User.find_one({"email": u_data["email"]})
        if not existing:
            u = User(
                username=u_data["email"],
                email=u_data["email"],
                full_name=u_data["full_name"],
                password=AuthService.get_password_hash("password123"),
                points=u_data["points"],
                avatar=u_data["avatar"],
                role="student"
            )
            await u.insert()

    print("Successfully seeded top leaderboard users into MongoDB!")
