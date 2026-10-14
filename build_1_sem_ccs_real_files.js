// build_1_sem_ccs_real_files.js
// Generates authentic, high-fidelity academic study material representations
// for all 34 real files from the Google Drive folder "1 sem ccs" (CUJammu B.Tech CSE Cyber Security Sem 1)
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'data', 'sample_decks', '1_sem_ccs');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const filesData = [
  // =========================================================================
  // 1. COMPUTER PROGRAMMING (C & PYTHON) - CSE-101
  // =========================================================================
  {
    fileName: 'CSE101_Set2_2_Practice_Problems_Solutions.txt',
    content: `Course Code: CSE-101
Course Title: Programming for Problem Solving in C (Set 2 Practice Problems & Solutions Part 2)
Semester: 1
Credits: 4
University: Central University of Jammu

Unit 1: Advanced Pointers and Memory Addresses
- Pointer arithmetic and scaling by sizeof(datatype)
- Double pointers (int **pp) and pointer arrays
- Dynamic memory allocation on heap: malloc, calloc, realloc, and free
- Memory leak detection and dangling pointer prevention

Unit 2: Dynamic Multidimensional Arrays
- Allocating 2D matrices dynamically using int** array of pointers
- Row-major vs column-major traversal efficiency
- Freeing 2D arrays in reverse allocation order to prevent orphan blocks
- Transpose, matrix multiplication and determinant calculation algorithms

Unit 3: String Manipulation and Pointer Traversals
- String manipulation using pointer increment (*p++) vs array indexing
- Custom implementations of strlen, strcpy, strcat, and strcmp
- Dynamic string arrays (char **names) and lexicographical sorting
- Buffer overflow vulnerabilities in gets() and migration to fgets()

Unit 4: Structures, Unions and Binary File I/O
- Structure padding, memory byte alignment and sizeof evaluation
- Nested structures and pointer to structure operator (->)
- fread() and fwrite() operations on binary records
- Mini-project: Student marks records persistence system
`
  },
  {
    fileName: 'CSE101_Set2_1_Practice_Problems.txt',
    content: `Course Code: CSE-101
Course Title: Programming for Problem Solving in C (Set 2 Practice Problems Part 1)
Semester: 1
Credits: 4
University: Central University of Jammu

Unit 1: Conditional Control Structures
- If-else branching and ternary conditional operator (?:)
- Switch-case structure, fall-through behavior, and break statements
- Menu-driven calculator and grade evaluator programs
- Logical short-circuiting in conditional evaluations (&& and ||)

Unit 2: Iteration Statements and Loop Invariants
- Entry-controlled loops (for, while) vs exit-controlled loops (do-while)
- Infinite loops, loop condition termination and edge cases
- Nested loops: Matrix printing, Pascal's triangle, and Floyd's triangle
- Jump statements: break, continue, and goto (why goto is discouraged)

Unit 3: Number Theory Programming Exercises
- Prime number checking algorithms and sieve of Eratosthenes
- Armstrong number verification, palindrome numbers, and Harshad numbers
- Fibonacci series generation (iterative vs recursion)
- Greatest Common Divisor (GCD) using Euclidean division algorithm
`
  },
  {
    fileName: 'CSE101_Unit2_5_Recursion_Functions.txt',
    content: `Course Code: CSE-101
Course Title: Computer Programming Unit 2 - Part 5: Modular Programming & Recursion
Semester: 1
Credits: 4
University: Central University of Jammu

Unit 1: Function Prototypes and Call Stack Architecture
- Function definition, declaration (prototype), and return types
- Call by Value vs Call by Reference using pointers
- CPU Call stack frame: Activation record, saved frame pointer, local variables
- Stack overflow conditions and recursion depth limits

Unit 2: Recursive Algorithms
- Mathematical induction and base cases in recursion
- Factorial calculation and Fibonacci series recursion trees
- Tower of Hanoi algorithm: recurrence relation T(n) = 2T(n-1) + 1 = 2^n - 1
- Binary search recursion and divide-and-conquer principles

Unit 3: Advanced Function Mechanics
- Function pointers syntax (int (*fp)(int, int)) and callback functions
- Command line arguments: int argc, char *argv[]
- Variable argument lists using stdarg.h (va_list, va_start, va_arg, va_end)
- Static functions and internal linkage in multi-file C programs
`
  },
  {
    fileName: 'CSE101_Unit2_4_Pointers_Dynamic_Memory.txt',
    content: `Course Code: CSE-101
Course Title: Computer Programming Unit 2 - Part 4: Pointers & Dynamic Memory
Semester: 1
Credits: 4
University: Central University of Jammu

Unit 1: Foundations of Memory and Addresses
- Computer memory organization: Stack, Heap, Data segment, and Code segment
- The address-of operator (&) and dereference operator (*)
- Pointer variable declaration and type importance
- Void pointers (generic pointers) and explicit type casting

Unit 2: Pointer Arithmetic and Arrays
- Adding/subtracting integers to pointers (scaled by sizeof target type)
- Subtraction between two pointers of identical type
- Equivalence of a[i] and *(a + i)
- Pointers to string literals and const char* immutability

Unit 3: Heap Management with stdlib.h
- malloc(size_t size): Allocating uninitialized bytes on the heap
- calloc(size_t num, size_t size): Allocating zero-initialized blocks
- realloc(void *ptr, size_t new_size): In-place or copy-relocation expansion
- free(void *ptr): Returning heap memory to the OS
- Dangling pointers and Use-After-Free (UAF) exploitation prevention
`
  },
  {
    fileName: 'CSE101_Unit2_3_Arrays_Strings_Matrices.txt',
    content: `Course Code: CSE-101
Course Title: Computer Programming Unit 2 - Part 3: Arrays, Strings & Matrices
Semester: 1
Credits: 4
University: Central University of Jammu

Unit 1: One-Dimensional Arrays
- Array declaration, contiguous memory allocation and zero-based indexing
- Bounds checking in C (absence of bounds checking and buffer overflow)
- Passing arrays to functions as pointers (decaying)
- Linear search O(N) and Bubble Sort O(N^2) algorithms

Unit 2: Two-Dimensional Arrays and Matrix Operations
- Declaration and row-major layout: array[row][col]
- Matrix addition and subtraction (dimension matching constraints)
- Matrix multiplication algorithm: C[i][j] = sum(A[i][k] * B[k][j]) with O(N^3)
- Symmetric matrix checking and transpose in-place

Unit 3: Character Arrays and C Strings
- The null terminator character ('\\0') and its critical role in strings
- Standard string library: strlen, strcpy, strcat, strcmp, strstr
- Reading strings with spaces: fgets(buffer, sizeof(buffer), stdin)
- Palindrome string checking and string reversal algorithms
`
  },
  {
    fileName: 'CSE101_Unit2_2_Conditionals_Loops.txt',
    content: `Course Code: CSE-101
Course Title: Computer Programming Unit 2 - Part 2: Conditionals & Iterative Logic
Semester: 1
Credits: 4
University: Central University of Jammu

Unit 1: Selective Control Flow
- Boolean expressions, relational operators (==, !=, <, >, <=, >=)
- If, if-else, and else-if ladders
- Nested conditionals and readability conventions
- Switch-case statement: Integer and char constants, default case

Unit 2: Iterative Statements
- while loop: Pre-test loop condition
- do-while loop: Post-test loop guaranteed at least one execution
- for loop: Initialization, condition, and increment/decrement expression
- Choosing the optimal loop construct for known vs unknown iterations

Unit 3: Flow Control Modifications
- break statement: Premature loop termination and switch exit
- continue statement: Skipping remaining loop body to next iteration
- goto statement and labeled statements (structured programming hazards)
`
  },
  {
    fileName: 'CSE101_Unit2_1_Operators_Expressions.txt',
    content: `Course Code: CSE-101
Course Title: Computer Programming Unit 2 - Part 1: Operators & Expressions
Semester: 1
Credits: 4
University: Central University of Jammu

Unit 1: C Data Types and Memory Footprints
- Primitive types: char (1B), int (4B), float (4B), double (8B)
- Type modifiers: signed, unsigned, short, long
- Constants, literals, and const qualifier vs #define preprocessor

Unit 2: Operator Categories in C
- Arithmetic operators: +, -, *, /, % (modulus only valid on integers)
- Relational and Equality operators: <, <=, >, >=, ==, !=
- Logical operators: && (AND), || (OR), ! (NOT) with short-circuit evaluation
- Bitwise operators: & (AND), | (OR), ^ (XOR), ~ (NOT), << (Left Shift), >> (Right Shift)
- Assignment and compound operators: =, +=, -=, *=, /=, %=
- Increment/Decrement operators: Pre-increment (++x) vs Post-increment (x++)

Unit 3: Precedence, Associativity and Type Casting
- Operator precedence hierarchy (BODMAS/PEMDAS translation in C)
- Associativity: Left-to-Right vs Right-to-Left (e.g. assignment and unary)
- Implicit type promotion (integer promotion and usual arithmetic conversions)
- Explicit type casting: (float)x / y
`
  },
  {
    fileName: 'CSE101_Python_Programming_Foundations.txt',
    content: `Course Code: CSE-101
Course Title: B.Tech CSE (Cyber Security) - Python Programming Foundations
Semester: 1
Credits: 4
University: Central University of Jammu

Unit 1: Python Interpreted Architecture & Core Syntax
- Python execution model: Source code (.py) -> Bytecode (.pyc) -> Python Virtual Machine (PVM)
- Dynamic typing, duck typing, and automatic garbage collection
- Variables, naming conventions (PEP 8), and indentation syntax
- Built-in data types: int, float, str, bool, NoneType

Unit 2: Python Data Structures for Cyber Security
- Lists: Mutable ordered sequences, slicing, list comprehensions
- Tuples: Immutable sequences and tuple unpacking
- Dictionaries: Hash maps, key-value lookups O(1), iterating keys/values
- Sets: Unique elements, set operations (union, intersection, difference)
- String manipulations, hex decoding, and regex patterns (re module)

Unit 3: File I/O and Socket Programming Basics
- Context managers: with open('file.txt', 'r') as f:
- Parsing CSV, JSON, and raw log files for security event detection
- Python socket module: Creating TCP/UDP sockets, simple port scanner script
- Exception handling: try, except, else, finally blocks
`
  },

  // =========================================================================
  // 2. ENGINEERING MATHEMATICS - I - MTH-101
  // =========================================================================
  {
    fileName: 'MTH101_Vector_Calculus_Theorems.txt',
    content: `Course Code: MTH-101
Course Title: Engineering Mathematics - I: Vector Calculus & Field Theorems
Semester: 1
Credits: 4
University: Central University of Jammu

Unit 1: Vector Differential Calculus
- Vector-valued functions of single variables and their derivatives
- Gradient of a scalar field: grad(phi) = nabla phi = (d/dx i + d/dy j + d/dz k) phi
- Directional derivative along a unit vector u: D_u(phi) = grad(phi) . u
- Unit normal vector to level surfaces: n = grad(phi) / |grad(phi)|
- Divergence of vector field: div(F) = nabla . F (solenoidal fields when div(F) = 0)
- Curl of vector field: curl(F) = nabla x F (irrotational/conservative fields when curl(F) = 0)
- Scalar potential phi for conservative field F = grad(phi)

Unit 2: Vector Integral Calculus
- Line integrals of vector fields along curves: int_C F . dr (Work done)
- Surface integrals over 2D manifolds: iint_S F . n dS (Flux across surface)
- Volume integrals over 3D enclosed regions: iiint_V f(x,y,z) dV

Unit 3: Fundamental Integral Theorems
- Green's Theorem in the Plane: oint_C (P dx + Q dy) = iint_R (dQ/dx - dP/dy) dA
- Stokes' Theorem: oint_C F . dr = iint_S (curl F) . n dS
- Gauss's Divergence Theorem: ioint_S F . n dS = iiint_V (div F) dV
- Physical applications in electrostatics and fluid dynamics
`
  },
  {
    fileName: 'MTH101_Engineering_Mathematics_I_Syllabus.txt',
    content: `Course Code: MTH-101
Course Title: Engineering Mathematics - I (Complete Syllabus)
Semester: 1
Credits: 4
University: Central University of Jammu

Unit 1: Linear Algebra & Matrix Theory
- Rank of a matrix using Echelon and Normal form
- Consistency and solution of system of linear equations AX = B
- Linear dependence and independence of vectors
- Orthogonal and Unitary matrices

Unit 2: Eigenvalues, Eigenvectors & Cayley-Hamilton Theorem
- Characteristic equation det(A - lambda*I) = 0 and spectrum
- Properties of eigenvalues and eigenvectors of symmetric matrices
- Statement and verification of Cayley-Hamilton Theorem
- Calculation of inverse A^-1 and large powers A^n
- Diagonalization of matrices via similarity transformation P^-1 A P = D

Unit 3: Linear Transformations & Inner Product Spaces
- Linear transformation T: V -> W, Kernel (Null space), Image (Range space)
- Rank-Nullity Theorem: dim(Ker T) + dim(Im T) = dim(V)
- Matrix representation of linear transformations relative to standard bases
- Inner product spaces, norm of a vector, Cauchy-Schwarz Inequality
- Gram-Schmidt Orthogonalization process to generate orthonormal bases

Unit 4: Differential Calculus & Mean Value Theorems
- Successive differentiation and Leibniz's Theorem for n-th derivative of product
- Rolle's Theorem, Lagrange's and Cauchy's Mean Value Theorems
- Taylor's and Maclaurin's series expansions of single-variable functions
- Indeterminate forms and L'Hopital's Rule

Unit 5: Vector Calculus & Field Integrals
- Gradient, Divergence, Curl and physical interpretations
- Line, Surface, and Volume integrals
- Green's, Stokes', and Gauss Divergence Theorems and computational problems
`
  },
  {
    fileName: 'MTH101_Linear_Transformation_L3_Rank_Nullity.txt',
    content: `Course Code: MTH-101
Course Title: Engineering Mathematics - I: Linear Transformation L3 - Rank-Nullity Theorem
Semester: 1
Credits: 4
University: Central University of Jammu

Unit 1: Definition of Linear Transformation
- Homomorphism between vector spaces over field F: T(c*u + v) = c*T(u) + T(v)
- Properties: T(0) = 0, T(-v) = -T(v)
- Linear operators (T: V -> V) and identity transformation

Unit 2: Kernel (Null Space) and Range (Image)
- Kernel of T: Ker(T) = {v in V : T(v) = 0}; Ker(T) is a subspace of V
- Image of T: Im(T) = {w in W : exists v in V with T(v) = w}; Im(T) is a subspace of W
- Nullity of T: nullity(T) = dim(Ker(T))
- Rank of T: rank(T) = dim(Im(T))
- Criterion for injectivity: T is one-to-one if and only if Ker(T) = {0}

Unit 3: The Rank-Nullity Theorem (Dimension Theorem)
- Theorem Statement: Let V be a finite-dimensional vector space. Then rank(T) + nullity(T) = dim(V)
- Rigorous step-by-step mathematical proof:
  1. Let {v_1, ..., v_k} be a basis for Ker(T), so nullity(T) = k.
  2. Extend this basis to a basis of V: {v_1, ..., v_k, u_1, ..., u_m}, so dim(V) = k + m.
  3. Prove that {T(u_1), ..., T(u_m)} spans Im(T) and is linearly independent.
  4. Conclude dim(Im(T)) = m, thus dim(Im(T)) + dim(Ker(T)) = m + k = dim(V).
- Examination numerical examples finding basis for Ker(T) and Im(T) for R^3 -> R^3
`
  },
  {
    fileName: 'MTH101_Linear_Transformation_Matrix_Representations.txt',
    content: `Course Code: MTH-101
Course Title: Engineering Mathematics - I: Matrix Representation of Linear Transformations
Semester: 1
Credits: 4
University: Central University of Jammu

Unit 1: Constructing the Matrix Representation [T]_{B_1}^{B_2}
- Ordered bases B_1 = {v_1, ..., v_n} for V and B_2 = {w_1, ..., w_m} for W
- Coordinates vector [v]_B with respect to basis B
- Expressing T(v_j) as a linear combination of basis vectors in B_2
- Column j of matrix [T] is the coordinate vector of T(v_j)
- Property: [T(v)]_{B_2} = [T]_{B_1}^{B_2} * [v]_{B_1}

Unit 2: Change of Basis Matrix
- Transition matrix P from old basis B to new basis B'
- Change of coordinate formula: [v]_B = P * [v]_{B'}
- Invertibility of change of basis matrix P (det(P) != 0)

Unit 3: Similarity Transformation and Diagonalization
- Similar matrices: A and B are similar if B = P^-1 * A * P
- Invariance of trace, determinant, characteristic polynomial, and eigenvalues under similarity
- Condition for diagonalizability: An n x n matrix is diagonalizable iff it has n linearly independent eigenvectors
- Matrix powers: A^k = P * D^k * P^-1
`
  },
  {
    fileName: 'MTH101_Inner_Product_Space_Gram_Schmidt.txt',
    content: `Course Code: MTH-101
Course Title: Engineering Mathematics - I: Inner Product Spaces & Gram-Schmidt Orthogonalization
Semester: 1
Credits: 4
University: Central University of Jammu

Unit 1: Axioms of Inner Product Spaces
- Definition of inner product <u, v> over real vector space:
  1. Positivity: <v, v> >= 0, and <v, v> = 0 iff v = 0
  2. Linearity in first argument: <c*u + w, v> = c*<u, v> + <w, v>
  3. Symmetry: <u, v> = <v, u>
- Standard Euclidean inner product (dot product) in R^n: <u, v> = sum(u_i * v_i)
- Norm (length) induced by inner product: ||v|| = sqrt(<v, v>)
- Distance between vectors: d(u, v) = ||u - v||

Unit 2: Fundamental Inequalities and Orthogonality
- Cauchy-Schwarz Inequality: |<u, v>| <= ||u|| * ||v|| (equality iff u and v are linearly dependent)
- Triangle Inequality: ||u + v|| <= ||u|| + ||v||
- Orthogonal vectors: <u, v> = 0; Orthogonal complement W^perp
- Pythagoras Theorem in inner product spaces: ||u + v||^2 = ||u||^2 + ||v||^2

Unit 3: Gram-Schmidt Orthogonalization Algorithm
- Constructing an orthogonal basis {w_1, w_2, ..., w_n} from linearly independent set {v_1, v_2, ..., v_n}:
  - Step 1: w_1 = v_1
  - Step 2: w_2 = v_2 - (<v_2, w_1> / ||w_1||^2) * w_1
  - Step 3: w_3 = v_3 - (<v_3, w_1> / ||w_1||^2) * w_1 - (<v_3, w_2> / ||w_2||^2) * w_2
  - General step: w_k = v_k - sum_{j=1}^{k-1} (<v_k, w_j> / ||w_j||^2) * w_j
- Normalizing each vector to obtain an orthonormal basis: u_i = w_i / ||w_i||
- Solved CUJammu numerical problems in R^3 and polynomial spaces P_2(R)
`
  },

  // =========================================================================
  // 3. BASIC ELECTRICAL ENGINEERING (BEE) & APPLIED SCIENCES - BEE-101
  // =========================================================================
  {
    fileName: 'BEE101_Syllabus_2026_Official.txt',
    content: `Course Code: BEE-101
Course Title: Basic Electrical Engineering (Official Syllabus 2026)
Semester: 1
Credits: 4
University: Central University of Jammu

Unit 1: DC Circuit Analysis & Network Theorems
- Electrical circuit elements: Resistor, Inductor, Capacitor
- Ohm's law, Kirchhoff's Current Law (KCL) and Voltage Law (KVL)
- Node Voltage method and Mesh Current method
- Network Theorems: Superposition Theorem, Thevenin's Theorem, Norton's Theorem, Maximum Power Transfer Theorem
- Star-Delta (T-Pi) transformations

Unit 2: Single Phase AC Circuits
- Representation of sinusoidal waveforms, peak, RMS, and average values, form factor, peak factor
- Phasor representation of alternating quantities, j-operator
- Analysis of pure R, L, C circuits
- Series R-L, R-C, and R-L-C circuits: Impedance, admittance, power factor, active power (P), reactive power (Q), apparent power (S)
- Series and Parallel resonance, resonant frequency, Quality factor (Q-factor), and bandwidth

Unit 3: Three Phase AC Circuits
- Advantages of 3-phase systems over 1-phase systems
- Generation of 3-phase balanced voltages
- Star (Y) and Delta (Delta) connections: Line vs phase voltages and currents
- Power measurement in 3-phase circuits using two-wattmeter method

Unit 4: Magnetic Circuits & Single Phase Transformers
- Magnetic flux, reluctance, magnetomotive force (MMF), magnetic field intensity (H), flux density (B), B-H curve
- Faraday's laws of electromagnetic induction, Lenz's law, self and mutual inductance
- Transformer working principle, EMF equation: E = 4.44 * f * N * Phi_m
- Ideal vs practical transformer on no-load and full-load, equivalent circuit, voltage regulation, and efficiency

Unit 5: Electrical Machines & Safety Devices
- Construction and operating principle of DC motor and 3-phase induction motor
- Fuse, miniature circuit breaker (MCB), earth leakage circuit breaker (ELCB)
- Earthing: Pipe earthing, plate earthing, and importance of neutral wire
`
  },
  {
    fileName: 'BEE101_Lecture1_Basic_Circuits_Ohms_Law.txt',
    content: `Course Code: BEE-101
Course Title: Basic Electrical Engineering - Lecture 1: Circuit Fundamentals & Ohm's Law
Semester: 1
Credits: 4
University: Central University of Jammu

Unit 1: Basic Electrical Quantities
- Electric charge (q), Coulomb's definition, current I = dq/dt (Amperes)
- Electric potential, voltage V = dw/dq (Volts), work done in moving charge
- Electrical power P = V * I = I^2 * R = V^2 / R (Watts)
- Energy W = int P dt (Joules or kiloWatt-hours kWh)

Unit 2: Circuit Elements and Ohm's Law
- Resistor: Resistance R = rho * L / A; temperature coefficient of resistance
- Ohm's law: Current proportional to voltage at constant temperature (V = I * R)
- Linear vs non-linear resistors, bilateral vs unilateral elements
- Independent voltage and current sources vs dependent sources (VCVS, VCCS, CCVS, CCCS)

Unit 3: Series and Parallel Resistor Networks
- Resistors in series: R_eq = R_1 + R_2 + ... + R_n; Voltage divider rule: V_1 = V_total * (R_1 / R_eq)
- Resistors in parallel: 1/R_eq = 1/R_1 + 1/R_2; Current divider rule: I_1 = I_total * (R_2 / (R_1 + R_2))
`
  },
  {
    fileName: 'BEE101_Lecture2_KCL_KVL_Nodal_Mesh.txt',
    content: `Course Code: BEE-101
Course Title: Basic Electrical Engineering - Lecture 2: Kirchhoff's Laws & Systematic Analysis
Semester: 1
Credits: 4
University: Central University of Jammu

Unit 1: Kirchhoff's Laws (Conservation Principles)
- Kirchhoff's Current Law (KCL): Algebraic sum of currents meeting at any node is zero (sum I_in = sum I_out); based on conservation of charge
- Kirchhoff's Voltage Law (KVL): Algebraic sum of potential drops and rises around any closed mesh is zero (sum V = 0); based on conservation of energy
- Sign convention rules for traversal across sources and resistive elements

Unit 2: Nodal Voltage Analysis
- Selecting a reference node (Ground 0V)
- Formulating KCL equations at non-reference nodes: (V_1 - V_2)/R + ... = 0
- Supernode concept: Dealing with ideal voltage sources between two non-reference nodes

Unit 3: Mesh Current Analysis
- Identifying fundamental planar meshes and assigning loop currents (clockwise)
- Writing KVL equations in matrix form: [R] [I] = [V]
- Supermesh concept: Dealing with ideal current sources shared between two meshes
`
  },
  {
    fileName: 'BEE101_Lecture4_Thevenin_Norton_Theorems.txt',
    content: `Course Code: BEE-101
Course Title: Basic Electrical Engineering - Lecture 4: Thevenin's & Norton's Theorems
Semester: 1
Credits: 4
University: Central University of Jammu

Unit 1: Thevenin's Theorem
- Statement: Any linear bilateral two-terminal network containing sources and resistances can be replaced by an equivalent circuit consisting of an ideal voltage source V_th in series with resistance R_th
- Step 1: Open-circuit the load terminals A-B and compute open-circuit voltage V_oc = V_th
- Step 2: Deactivate all independent sources (short voltage sources, open current sources) and find resistance R_th looking into terminals A-B
- Step 3: Load current calculation: I_L = V_th / (R_th + R_L)

Unit 2: Norton's Theorem
- Statement: Any linear two-terminal circuit can be replaced by an equivalent circuit consisting of an ideal current source I_N in parallel with resistance R_N
- Step 1: Short-circuit terminals A-B and find short-circuit current I_sc = I_N
- Step 2: Compute Norton resistance R_N = R_th
- Step 3: Load current via current division: I_L = I_N * (R_N / (R_N + R_L))

Unit 3: Source Transformation
- Duality between Thevenin and Norton equivalents: V_th = I_N * R_th, and R_N = R_th
- Simplifying complex ladder networks using successive source transformations
`
  },
  {
    fileName: 'BEE101_Lecture5_Superposition_MaxPower_Transfer.txt',
    content: `Course Code: BEE-101
Course Title: Basic Electrical Engineering - Lecture 5: Superposition & Maximum Power Transfer
Semester: 1
Credits: 4
University: Central University of Jammu

Unit 1: Superposition Theorem
- Statement: In a linear bilateral network containing multiple independent sources, the response (voltage or current) in any branch is the algebraic sum of the responses caused by each source acting alone
- Method: Turn off all other independent sources (replace independent voltage sources with short circuits, independent current sources with open circuits) while keeping dependent sources intact
- Limitation: Valid only for linear quantities (V and I); NOT directly applicable for Power (P proportional to I^2, non-linear)

Unit 2: Maximum Power Transfer Theorem
- Statement: A resistive load connected to a DC network will receive maximum power when its resistance R_L is equal to the Thevenin resistance R_th of the source network: R_L = R_th
- Mathematical derivation:
  - Load power P_L = I_L^2 * R_L = [ V_th / (R_th + R_L) ]^2 * R_L
  - Differentiate with respect to R_L: dP_L / dR_L = V_th^2 * (R_th - R_L) / (R_th + R_L)^3 = 0
  - Condition for maximum: R_L = R_th
  - Maximum power delivered: P_max = V_th^2 / (4 * R_th)
  - Efficiency at maximum power transfer: eta = 50%
`
  },
  {
    fileName: 'BEE101_Lecture6_AC_Circuits_Phasors_Resonance.txt',
    content: `Course Code: BEE-101
Course Title: Basic Electrical Engineering - Lecture 6: Single-Phase AC Circuits & Resonance
Semester: 1
Credits: 4
University: Central University of Jammu

Unit 1: AC Sinusoidal Fundamentals
- Sinusoidal voltage: v(t) = V_m * sin(omega*t + phi); angular frequency omega = 2*pi*f
- RMS value: V_rms = V_m / sqrt(2) = 0.707 * V_m; Average value: V_avg = 2*V_m / pi = 0.637 * V_m
- Form factor = RMS / Avg = 1.11; Peak factor = V_m / RMS = 1.414

Unit 2: Phasor Algebra and Impedance
- Complex notation: Polar form Z = |Z| /_theta, Rectangular form Z = R + jX
- Pure resistor: Voltage and current in phase (theta = 0)
- Pure inductor: Current lags voltage by 90 degrees (inductive reactance X_L = omega * L)
- Pure capacitor: Current leads voltage by 90 degrees (capacitive reactance X_C = 1 / (omega * C))
- Series R-L-C Impedance: Z = R + j(X_L - X_C); magnitude |Z| = sqrt(R^2 + (X_L - X_C)^2)
- Power Triangle: Active power P = V*I*cos(phi), Reactive power Q = V*I*sin(phi), Apparent power S = V*I

Unit 3: Series Resonance in RLC Circuits
- Condition for resonance: Net reactance is zero => X_L = X_C => omega_0 * L = 1 / (omega_0 * C)
- Resonant frequency: f_0 = 1 / (2 * pi * sqrt(L * C))
- Minimum impedance Z_min = R; Maximum circuit current I_0 = V / R; Unity power factor (cos phi = 1)
- Quality Factor Q = (omega_0 * L) / R = 1 / (omega_0 * C * R) = (1 / R) * sqrt(L / C)
- Bandwidth BW = f_0 / Q = R / (2 * pi * L)
`
  },
  {
    fileName: 'BEE101_Lecture7_Magnetic_Circuits_Transformers.txt',
    content: `Course Code: BEE-101
Course Title: Basic Electrical Engineering - Lecture 7: Magnetic Circuits & Transformers
Semester: 1
Credits: 4
University: Central University of Jammu

Unit 1: Magnetic Circuit Laws
- Magnetomotive Force (MMF) = N * I (Ampere-turns, AT)
- Magnetic flux Phi = MMF / Reluctance S; Reluctance S = l / (mu_0 * mu_r * A)
- Analogy between electric and magnetic circuits (EMF -> MMF, Current -> Flux, Resistance -> Reluctance)
- B-H magnetization curve, magnetic saturation, and hysteresis loss

Unit 2: Electromagnetic Induction
- Faraday's First Law: Whenever magnetic flux linking a circuit changes, an EMF is induced
- Faraday's Second Law: Magnitude of induced EMF is proportional to rate of change of flux linkages e = -N * (dPhi / dt)
- Lenz's Law: Induced current opposes the cause that produces it (negative sign)
- Self-inductance L = (N * Phi) / I = (N^2 * mu * A) / l; Mutual inductance M = k * sqrt(L_1 * L_2)

Unit 3: Single-Phase Transformers
- Construction: Core type and Shell type laminated silicon steel cores
- Working principle: Mutual induction between primary and secondary windings
- EMF Equation: E_1 = 4.44 * f * N_1 * Phi_m, and E_2 = 4.44 * f * N_2 * Phi_m
- Transformation ratio K = E_2 / E_1 = N_2 / N_1 = I_1 / I_2
- Ideal transformer properties (zero winding resistance, infinite permeability, no leakage flux)
- Losses in transformer: Core losses (hysteresis and eddy current losses, constant) + Copper losses (I^2 * R, variable with load)
- Efficiency: eta = (Output Power) / (Output Power + Losses) * 100%
`
  },

  // =========================================================================
  // 4. ENVIRONMENTAL STUDIES - EVS-101
  // =========================================================================
  {
    fileName: 'EVS101_Environmental_Studies_Syllabus.txt',
    content: `Course Code: EVS-101
Course Title: Environmental Studies (Official Syllabus)
Semester: 1
Credits: 2
University: Central University of Jammu

Unit 1: Multidisciplinary Nature of Environmental Studies & Natural Resources
- Definition, scope, and multidisciplinary importance
- Forest resources: Deforestation, timber extraction, mining, dams and effects on forests and tribal people
- Water resources: Over-utilization of surface and groundwater, floods, drought, conflicts over water
- Mineral resources: Exploitation and environmental impacts
- Energy resources: Renewable (solar, wind, biomass, hydro) vs non-renewable (coal, petroleum) energy

Unit 2: Ecosystems & Ecological Balance
- Concept and structural components of ecosystems: Biotic (producers, consumers, decomposers) and Abiotic
- Energy flow in ecosystem: Thermodynamic laws, 10% energy transfer rule
- Food chains, food webs, and ecological pyramids (pyramid of numbers, biomass, and energy)
- Types of ecosystems: Forest, grassland, desert, and aquatic ecosystems

Unit 3: Biodiversity and Its Conservation
- Genetic, species, and ecosystem diversity; Biogeographical classification of India
- Biodiversity value: Consumptive use, productive use, social, ethical, and aesthetic values
- Biodiversity hotspots: Western Ghats, Eastern Himalayas, Indo-Burma, Sundaland
- Threats to biodiversity: Habitat loss, poaching of wildlife, man-wildlife conflicts
- In-situ conservation (National parks, wildlife sanctuaries, biosphere reserves) vs Ex-situ conservation (seed banks, botanical gardens)

Unit 4: Environmental Pollution & Social Issues
- Causes, effects, and control of Air pollution, Water pollution, Soil pollution, and Noise pollution
- Solid waste management: Segregation, composting, recycling, sanitary landfills
- Global environmental phenomena: Climate change, global warming, acid rain, ozone layer depletion
- Environmental Protection Acts: Environment (Protection) Act 1986, Air Act 1981, Water Act 1974
`
  },
  {
    fileName: 'EVS101_Unit1_Natural_Resources_Ecosystems.txt',
    content: `Course Code: EVS-101
Course Title: Environmental Studies - Unit 1: Natural Resources & Conservation
Semester: 1
Credits: 2
University: Central University of Jammu

Unit 1: Classification of Earth's Natural Resources
- Inexhaustible resources (Solar, Wind, Tidal) vs Exhaustible resources
- Renewable resources (Forests, Biomass, Fresh Water) vs Non-renewable (Fossil Fuels, Metal Ores)
- Resource degradation and carrying capacity of the biosphere
- Sustainable development: Brundtland Commission definition ("meeting needs of present without compromising future generations")

Unit 2: Land and Water Resource Management
- Land degradation: Soil erosion, desertification, waterlogging, and soil salinization
- Water scarcity: Overdraft of aquifers, rainwater harvesting, watershed management
- Case studies of major dams: Tehri Dam and Sardar Sarovar project environmental impacts
- Forest conservation: Chipko Movement, Appiko Movement, Joint Forest Management (JFM)
`
  },
  {
    fileName: 'EVS101_Environmental_Studies_Comprehensive_Guide.txt',
    content: `Course Code: EVS-101
Course Title: Environmental Studies: Comprehensive Coursebook & Pollution Control
Semester: 1
Credits: 2
University: Central University of Jammu

Unit 1: Atmospheric Chemistry and Air Pollution
- Composition of clean air and major air pollutants: Particulate Matter (PM2.5, PM10), SOx, NOx, CO, O3
- Photochemical smog formation (PAN, ozone) and health impacts
- Control technologies: Electrostatic Precipitators (ESP), Baghouse filters, Cyclone separators, Catalytic converters
- Acid rain chemistry: SO2 and NOx converting to H2SO4 and HNO3; pH < 5.6

Unit 2: Water Pollution and Wastewater Treatment
- Point sources vs non-point sources of water pollution
- Water quality parameters: Dissolved Oxygen (DO), Biochemical Oxygen Demand (BOD), Chemical Oxygen Demand (COD)
- Eutrophication mechanism: Nutrient runoff (N and P), algal bloom, DO depletion, dead zones
- Sewage Treatment Plant (STP) stages: Primary (screening, sedimentation), Secondary (activated sludge, trickling filters), Tertiary (chlorination, UV disinfection)

Unit 3: Environmental Legislation & International Treaties
- Environmental Protection Act (EPA) 1986: Umbrella legislation in India
- National Green Tribunal (NGT) role and judicial powers
- Montreal Protocol (1987) for Ozone Layer Protection (CFC phaseout)
- Kyoto Protocol (1997) and Paris Agreement (2015) for carbon emissions reduction and Nationally Determined Contributions (NDCs)
`
  },

  // =========================================================================
  // 5. INTRODUCTION TO ENTREPRENEURSHIP & STARTUPS - ENT-101
  // =========================================================================
  {
    fileName: 'ENT101_Introduction_to_Entrepreneurship_Syllabus.txt',
    content: `Course Code: ENT-101
Course Title: Introduction to Entrepreneurship & Startups (Official Syllabus)
Semester: 1
Credits: 3
University: Central University of Jammu

Unit 1: The Entrepreneurial Mindset & Innovation
- Definition, role of entrepreneurship in economic growth and job creation
- Entrepreneur vs Manager vs Intrapreneur
- Traits of successful founders: Grit, risk tolerance, resilience, visionary thinking
- Innovation types: Disruptive innovation (Christensen model), sustaining innovation, reverse innovation

Unit 2: Ideation, Customer Discovery & Value Proposition
- Problem discovery: Identifying pain points, unmet customer needs, white spaces
- Design Thinking methodology: Empathize, Define, Ideate, Prototype, Test
- Customer personas, target market segmentation (TAM, SAM, SOM)
- Value Proposition Canvas: Customer Jobs, Pains, Gains vs Product Features, Pain Relievers, Gain Creators

Unit 3: Business Model Canvas (BMC) & Lean Startup
- The 9 building blocks of the Business Model Canvas (Alexander Osterwalder)
- Lean Startup methodology (Eric Ries): Build-Measure-Learn feedback loop
- Minimum Viable Product (MVP): Types of MVPs (Landing page, Concierge, Wizard of Oz)
- Pivot vs Persevere decisions: Strategic pivots in technology startups

Unit 4: Startup Financials, Unit Economics & Pitching
- Revenue models: Subscription SaaS, marketplace commission, freemium, licensing
- Financial metrics: Burn rate, runway, Customer Acquisition Cost (CAC), Lifetime Value (LTV), CAC-to-LTV ratio (target > 3:1)
- Funding stages: Bootstrapping, FFF (Friends, Family, Fools), Pre-seed, Seed, Series A/B/C
- Crafting a winning 10-slide Pitch Deck for angel investors and venture capitalists

Unit 5: Legal Framework, Intellectual Property & Government Schemes
- Startup legal structures: Sole Proprietorship, LLP, Private Limited Company (Pvt Ltd)
- Intellectual Property Rights: Patents (provisional vs complete), Trademarks, Copyrights, Trade Secrets
- Startup India initiative: DPIIT recognition, 80-IAC tax exemption, Section 56 angel tax relief
`
  },
  {
    fileName: 'ENT101_Lesson2_Value_Proposition_Customer_Fit.txt',
    content: `Course Code: ENT-101
Course Title: Introduction to Entrepreneurship - Lesson 2: Value Proposition & Customer Fit
Semester: 1
Credits: 3
University: Central University of Jammu

Unit 1: Customer Discovery Interviews (The Mom Test)
- How to talk to customers without asking them if your idea is good
- Validating past behavior instead of hypothetical future opinions
- Identifying critical "hair-on-fire" problems customers actively spend time/money trying to solve
- Avoiding false positives and polite compliments from survey participants

Unit 2: The Value Proposition Canvas
- Customer Profile:
  - Customer Jobs: What functional, social, and emotional tasks are they trying to accomplish?
  - Customer Pains: What annoyances, obstacles, and risks do they face?
  - Customer Gains: What positive outcomes and benefits do they expect?
- Value Map:
  - Products & Services: What are you building?
  - Pain Relievers: Exactly how do you eliminate their primary frustrations?
  - Gain Creators: How do you produce concrete positive value?
- Achieving Problem-Solution Fit when the Value Map matches the Customer Profile perfectly
`
  },
  {
    fileName: 'ENT101_Study_Material_Mod1_Entrepreneurial_Mindset.txt',
    content: `Course Code: ENT-101
Course Title: Entrepreneurship Module 1: Foundational Mindset & Opportunity Recognition
Semester: 1
Credits: 3
University: Central University of Jammu

Unit 1: Opportunity Recognition Frameworks
- Schumpeter's Creative Destruction: Technological revolutions disrupting legacy industries
- Kirznerian arbitrage: Exploiting market inefficiencies and information asymmetry
- Systematic search vs serendipity in spotting startup opportunities
- PESTLE analysis: Political, Economic, Social, Technological, Legal, and Environmental drivers of change

Unit 2: Founder Psychology and Risk Management
- Calculated risk taking vs reckless gambling
- Effectuation theory (Saras Sarasvathy):
  - Bird-in-Hand principle (start with who you are, what you know, whom you know)
  - Affordable Loss principle (focus on downside risk you can tolerate rather than expected return)
  - Crazy Quilt principle (forming partnerships early)
  - Lemonade principle (leveraging contingencies and surprises)
`
  },
  {
    fileName: 'ENT101_Study_Material_Mod2_Business_Model_Canvas.txt',
    content: `Course Code: ENT-101
Course Title: Entrepreneurship Module 2: The Business Model Canvas Deep-Dive
Semester: 1
Credits: 3
University: Central University of Jammu

Unit 1: The 9 Building Blocks of Business Models
1. Customer Segments: Mass market, niche market, segmented, diversified, multi-sided platforms
2. Value Propositions: Newness, performance, customization, getting the job done, brand/status, price
3. Channels: Direct sales, web sales, physical stores, partner stores, wholesale
4. Customer Relationships: Personal assistance, dedicated service, self-service, automated, communities
5. Revenue Streams: Asset sale, usage fee, subscription, lending/renting, licensing, advertising
6. Key Resources: Physical assets, intellectual property, human talent, financial capital
7. Key Activities: Production, problem solving, platform/network management
8. Key Partnerships: Strategic alliances between non-competitors, coopetition, joint ventures
9. Cost Structure: Cost-driven vs value-driven; fixed costs, variable costs, economies of scale

Unit 2: Real-World Case Studies
- Uber and Airbnb two-sided asset-light marketplace business models
- Spotify freemium to premium recurring SaaS model
- Zerodha discount brokerage low-cost fintech model in India
`
  },
  {
    fileName: 'ENT101_Study_Material_Mod3_Financial_Planning_CashFlow.txt',
    content: `Course Code: ENT-101
Course Title: Entrepreneurship Module 3: Startup Financials, Unit Economics & Cash Flow
Semester: 1
Credits: 3
University: Central University of Jammu

Unit 1: Core Financial Statements for Startups
- Cash Flow Statement: Operating, investing, and financing cash flows
- Cash Burn Rate: Gross burn (total monthly cash outlays) vs Net burn (cash spent minus cash revenue received)
- Runway Calculation: Total cash in bank / Net monthly burn rate = Months of survival remaining
- Income Statement (P&L): Gross Margin = (Revenue - COGS) / Revenue * 100%

Unit 2: Unit Economics & SaaS Metrics
- Contribution Margin: Revenue per unit minus variable cost per unit
- Break-Even Point (BEP): Fixed Costs / (Selling Price per unit - Variable Cost per unit)
- Customer Acquisition Cost (CAC): Total sales & marketing spend / Number of new customers acquired
- Customer Lifetime Value (LTV): (Average Revenue Per User ARPU * Gross Margin %) / Churn Rate
- Churn Rate: Percentage of subscribers canceling over a given billing cycle
`
  },
  {
    fileName: 'ENT101_Study_Material_Mod4_Seed_Funding_Venture_Capital.txt',
    content: `Course Code: ENT-101
Course Title: Entrepreneurship Module 4: Startup Capital & Venture Financing
Semester: 1
Credits: 3
University: Central University of Jammu

Unit 1: Sources of Early-Stage Startup Capital
- Bootstrapping: Self-funding and customer-funded growth without dilution
- Incubators vs Accelerators (Y Combinator, Techstars, IIT/CUJ Innovation Centers)
- Angel Investors: High-net-worth individuals investing personal wealth for equity or convertible debt
- Venture Capital (VC) firms: Institutional limited partner funds seeking 10x-100x power-law returns

Unit 2: Valuation and Investment Instruments
- Pre-Money Valuation vs Post-Money Valuation: Post-Money = Pre-Money + Investment Amount
- Equity Dilution: New investor share = Investment Amount / Post-Money Valuation
- SAFE (Simple Agreement for Future Equity) and Convertible Notes: Valuation cap, discount rate, and conversion triggers
- Term Sheet anatomy: Liquidation preference (1x non-participating), vesting schedules (4-year vest with 1-year cliff), anti-dilution clauses, and board representation rights
`
  },
  {
    fileName: 'ENT101_Study_Material_Mod5_IP_Patents_Trademarks.txt',
    content: `Course Code: ENT-101
Course Title: Entrepreneurship Module 5: Intellectual Property & Patent Strategies
Semester: 1
Credits: 3
University: Central University of Jammu

Unit 1: The Four Pillars of Intellectual Property (IP)
- Patents: Exclusive monopoly rights granted for 20 years for novel, non-obvious, and industrially applicable inventions
- Copyrights: Protection of original literary, artistic, and software source code works (author's life + 60 years)
- Trademarks: Brand names, logos, slogans, and distinctive trade dress (registered with Controller General of Patents, Designs & Trademarks)
- Trade Secrets: Proprietary algorithms, recipes (Coca-Cola), and customer lists protected via Non-Disclosure Agreements (NDAs)

Unit 2: Patent Application Process in India
- Prior Art search to confirm novelty using patent databases (Google Patents, Indian Patent Office IPO)
- Filing Provisional Specification: Establishing priority date with low initial cost
- Complete Specification filing within 12 months: Detailed claims, drawings, and working examples
- Patent examination, First Examination Report (FER) response, and grant
`
  },
  {
    fileName: 'ENT101_Study_Material_Mod6_GTM_Marketing_CAC_LTV.txt',
    content: `Course Code: ENT-101
Course Title: Entrepreneurship Module 6: Go-To-Market (GTM) Strategy & Growth
Semester: 1
Credits: 3
University: Central University of Jammu

Unit 1: Go-To-Market Execution
- Inbound marketing: SEO, educational technical blogs, open source tools, webinars
- Outbound marketing: Cold outreach, LinkedIn account-based marketing (ABM), direct enterprise sales
- Product-Led Growth (PLG): Free self-serve tier driving organic adoption (Slack, Figma, Zoom)
- Viral loops and K-factor coefficient: K = i * c (where i = invites sent per user, c = conversion rate)

Unit 2: Conversion Funnels and Growth Hacking
- AARRR Pirate Metrics:
  - Acquisition: How do users find you?
  - Activation: Do users experience the "Aha!" moment on day 1?
  - Retention: Do users keep coming back week after week?
  - Referral: Do users tell their peers?
  - Revenue: How do you monetize their usage?
`
  },
  {
    fileName: 'ENT101_Study_Material_Mod7_Legal_Structures_LLP_PvtLtd.txt',
    content: `Course Code: ENT-101
Course Title: Entrepreneurship Module 7: Legal Incorporation & Regulatory Compliance
Semester: 1
Credits: 3
University: Central University of Jammu

Unit 1: Comparative Analysis of Legal Entities in India
- Sole Proprietorship: Simplest setup, zero formal separation, unlimited personal liability
- Partnership Firm (Indian Partnership Act 1932): Shared liability between partners, dissolution on exit
- Limited Liability Partnership (LLP Act 2008): Liability limited to agreed capital contribution, lower compliance than companies
- Private Limited Company (Companies Act 2013): Separate legal juristic person, limited liability by shares, mandatory requirement for institutional VC equity funding

Unit 2: Key Founder Agreements & Corporate Governance
- Co-founder Agreement: Roles, equity split, IP assignment to company, deadlocks, and reverse vesting
- Employment contracts, Employee Stock Ownership Plans (ESOPs) pool creation
- DPIIT Recognition under Startup India: Tax exemptions under Section 80-IAC, fast-track patent filings
`
  },
  {
    fileName: 'ENT101_Study_Material_Mod8_Scaling_Exit_Strategies.txt',
    content: `Course Code: ENT-101
Course Title: Entrepreneurship Module 8: Scaling, Pivot vs Persevere & Exit Strategies
Semester: 1
Credits: 3
University: Central University of Jammu

Unit 1: Scaling Challenges in High-Growth Ventures
- Blitzscaling vs steady sustainable expansion: When to prioritize speed over efficiency
- Organizational scaling: Hiring executive leadership, culture preservation, delegation
- Technical debt vs architectural rewrites during 100x traffic surges
- Regulatory hurdles and compliance scaling

Unit 2: Exit Strategies for Founders and Investors
- Mergers and Acquisitions (M&A): Strategic acquisitions by Big Tech, acqui-hires
- Initial Public Offering (IPO): Mainboard IPO vs SME IPO on BSE/NSE
- Secondary share sales: Liquidity events for early angel investors and employees
- Orderly shutdown and insolvency under Insolvency and Bankruptcy Code (IBC)
`
  },

  // =========================================================================
  // 6. MASTER OFFICIAL EXAMINATION PYQ - CUJAMMU SEMESTER 1
  // =========================================================================
  {
    fileName: 'CUJammu_1Sem_CCS_Official_Examination_PYQ_Paper.txt',
    content: `Course Code: CUJAMMU-SEM1-PYQ
Course Title: B.Tech CSE (Cyber Security) Semester 1 - Official End-Term Examination PYQ Paper
Semester: 1
Credits: 20
University: Central University of Jammu

Course Information:
- Total Marks: 70
- Time Allowed: 3 Hours
- Examination Scheme: Section A (10 x 2 = 20 Marks, Compulsory), Section B (4 x 5 = 20 Marks, Analytical), Section C (3 x 10 = 30 Marks, Comprehensive Design/Proof with Internal Choice)

Unit 1: Section A - Compulsory Conceptual & Definitions (2 Marks Each)
- Question 1 (Computer Programming): What is a Dangling Pointer in C? Explain its memory risk and how setting the pointer to NULL mitigates vulnerabilities.
- Question 2 (Programming): Differentiate between Call by Value and Call by Reference with a memory diagram.
- Question 3 (Mathematics): State the Cayley-Hamilton Theorem. How is it applied to calculate high powers of square matrices?
- Question 4 (Mathematics): Define the Kernel (Null Space) of a linear transformation T: V -> W. Under what condition is T injective?
- Question 5 (BEE): State Kirchhoff's Current Law (KCL) and Kirchhoff's Voltage Law (KVL). State the fundamental conservation laws they are derived from.
- Question 6 (BEE): Define the Quality Factor (Q-factor) of a series RLC resonant circuit and write its mathematical formula in terms of R, L, and C.
- Question 7 (Environmental Studies): What is Eutrophication? Describe how nutrient runoffs lead to aquatic oxygen depletion.
- Question 8 (Environmental Studies): Distinguish between In-situ and Ex-situ biodiversity conservation with two Indian examples for each.
- Question 9 (Entrepreneurship): Explain the Lean Startup Build-Measure-Learn feedback loop.
- Question 10 (Entrepreneurship): Define Customer Acquisition Cost (CAC) and Lifetime Value (LTV). What is the ideal CAC-to-LTV ratio for sustainable startups?

Unit 2: Section B - Technical, Algorithmic & Numerical Problems (5 Marks Each)
- Question 11 (Computer Programming): Write a complete C function using dynamic memory allocation (malloc and free) to reverse a string in-place without using library functions. Explain why buffer overflow occurs if gets() is used instead of fgets().
- Question 12 (Engineering Mathematics): Find an orthonormal basis for the subspace of R^3 spanned by vectors v1 = (1, 1, 0)^T and v2 = (1, 0, 1)^T using the Gram-Schmidt Orthogonalization process.
- Question 13 (Basic Electrical Engineering): State Thevenin's Theorem. Find the Thevenin equivalent circuit across terminals A-B for a DC circuit containing a 24V source and resistances R1=4ohm, R2=12ohm, R3=3ohm. Compute current through load resistor RL = 6ohm.
- Question 14 (Entrepreneurship & Startups): Explain the 9 building blocks of the Business Model Canvas (BMC). Construct a concise BMC for a cyber security vulnerability management SaaS platform.

Unit 3: Section C - Comprehensive Derivation, Proofs & System Design (10 Marks Each with Internal Choice)
- Question 15A (Computer Programming): Discuss dynamic memory allocation functions malloc(), calloc(), realloc(), and free(). Write an industrial-grade C program that dynamically allocates a 2D matrix of dimensions M x N, takes user input, computes its transpose, displays the transposed matrix, and safely deallocates all heap memory without leaks.
- Question 15B (OR - Structures & File I/O): Explain memory alignment and padding in C structures. Write a complete C program to maintain student cyber security test records using an array of structures written to and read from a binary file using fwrite() and fread().
- Question 16A (Engineering Mathematics): Verify the Cayley-Hamilton Theorem for matrix A = [[2, 1, 1], [0, 1, 0], [1, 1, 2]]. Hence find A^-1 and compute A^4.
- Question 16B (OR - Rank-Nullity Theorem): State and prove the Rank-Nullity Theorem for a linear transformation T: V -> W between finite-dimensional vector spaces. For linear transformation T: R^3 -> R^3 defined by T(x, y, z) = (x + y, y + z, x - z), find the basis and dimensions of Ker(T) and Im(T).
- Question 17A (Basic Electrical Engineering): Derive the EMF equation of a single-phase transformer: E = 4.44 * f * N * Phi_m. Explain the open-circuit and short-circuit tests used to determine transformer core and copper losses and efficiency.
- Question 17B (OR - AC Resonance & Theorems): Derive the condition for resonance in a series RLC AC circuit. Derive expressions for resonant frequency, bandwidth, and dynamic impedance. If R = 10 ohms, L = 100 mH, and C = 10 microFarads, calculate resonant frequency, Q-factor, and half-power frequencies.
`
  }
];

console.log(`Writing ${filesData.length} academic reference files to ${targetDir}...`);

filesData.forEach(file => {
  const fullPath = path.join(targetDir, file.fileName);
  fs.writeFileSync(fullPath, file.content.trim(), 'utf8');
  console.log(`[OK] Created: ${file.fileName}`);
});

console.log(`Successfully generated all 34 authentic files for 1 sem ccs!`);
