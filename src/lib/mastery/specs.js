/*
Courses shown on the Skill Radar page. Each `area` becomes one vertex of the radar.

Course keys match the existing course slugs (/learn/edx-maths-1 etc.).
  branch, year   which questions belong to the course: questions with this `branch` and `year`
                 (and progress is read from `<examBoard>-questions-<branch>-<y1|y2>-progress`)
Area fields:
  id         stable key
  name       full heading, shown in the hover card
  short      label drawn on the chart (keep it short, the chart is small on phones)
  matches    question `topic` values that count towards this area (compared case/punctuation-insensitively)
  subtopics  listed in the hover card

Pure and Statistics areas follow the Edexcel A level Maths (9MA0) specification sections.
Mechanics follows the standard textbook chapter split, because the specification has only
three Year 12 sections, which makes for a thin triangle on the radar.

Question documents for Statistics / Mechanics should use branch 'statistics' / 'mechanics'.
*/

export const SPECS = {
  'edx-maths-1': {
    id: 'edx-maths-1',
    name: 'Edexcel Pure Maths · Year 12',
    branch: 'pure',
    year: '12',
    // Lessons for this course: which chapters (docs in chapterCollection) belong to each radar area.
    // A lesson's slug is its title lower-cased with spaces -> '-', the same rule the course pages use.
    lessons: {
      chapterCollection: 'edx-pure-y1-subsections',
      progressCollection: 'edx-maths-1-lesson-progress',
      chaptersByArea: {
        proof: ['what-is-proof', 'methods-of-proof'],
        'algebra-functions': ['algebraic-expressions', 'algebraic-methods', 'quadratic-functions', 'simultaneous-equations', 'inequalities', 'graphs-and-transformations'],
        'coordinate-geometry': ['straight-lines', 'circles'],
        'sequences-series': ['binomial-expansion'],
        trigonometry: ['trigonometry-and-triangles', 'trignometric-graphs', 'ratios-identities-and-equations'],
        'exponentials-logarithms': ['exponential-functions', 'logarithms'],
        differentiation: ['gradients-and-lines', 'rates-of-change-and-modelling'],
        integration: ['indefinite-integrals', 'definite-integrals-and-areas'],
        vectors: [],
      },
    },
    areas: [
      { id: 'proof', name: 'Proof', short: 'Proof', matches: ['proof'], subtopics: ['Proof by deduction', 'Proof by exhaustion', 'Disproof by counter-example'] },
      {
        id: 'algebra-functions',
        name: 'Algebra and functions',
        short: 'Algebra',
        matches: ['algebra and functions', 'algebra'],
        subtopics: ['Indices', 'Surds', 'Quadratics', 'Simultaneous equations', 'Inequalities', 'Polynomials and the factor theorem', 'Graphs of functions', 'Transformations of graphs'],
      },
      {
        id: 'coordinate-geometry',
        name: 'Coordinate geometry in the (x, y) plane',
        short: 'Coordinate geometry',
        matches: ['coordinate geometry in the (x, y) plane', 'coordinate geometry'],
        subtopics: ['Straight lines', 'Parallel and perpendicular lines', 'Circles'],
      },
      { id: 'sequences-series', name: 'Sequences and series', short: 'Sequences & series', matches: ['sequences and series', 'binomial expansion'], subtopics: ['Binomial expansion', 'Factorial and nCr notation'] },
      {
        id: 'trigonometry',
        name: 'Trigonometry',
        short: 'Trigonometry',
        matches: ['trigonometry'],
        subtopics: ['Sine and cosine rules', 'Area of a triangle', 'Trigonometric graphs', 'Trigonometric identities', 'Solving trigonometric equations'],
      },
      {
        id: 'exponentials-logarithms',
        name: 'Exponentials and logarithms',
        short: 'Exp & logs',
        matches: ['exponentials and logarithms'],
        subtopics: ['Exponential functions', 'Laws of logarithms', 'Solving exponential equations', 'Exponential modelling'],
      },
      {
        id: 'differentiation',
        name: 'Differentiation',
        short: 'Differentiation',
        matches: ['differentiation'],
        subtopics: ['Differentiation from first principles', 'Differentiating polynomials', 'Tangents and normals', 'Stationary points', 'Increasing and decreasing functions'],
      },
      { id: 'integration', name: 'Integration', short: 'Integration', matches: ['integration'], subtopics: ['Indefinite integrals', 'Definite integrals', 'Areas under curves'] },
      {
        id: 'vectors',
        name: 'Vectors',
        short: 'Vectors',
        matches: ['vectors'],
        subtopics: ['Vectors in two dimensions', 'Magnitude and direction', 'Position vectors', 'Geometric problems with vectors'],
      },
    ],
  },

  'edx-maths-2': {
    id: 'edx-maths-2',
    name: 'Edexcel Pure Maths · Year 13',
    branch: 'pure',
    year: '13',
    areas: [
      { id: 'proof', name: 'Proof', short: 'Proof', matches: ['proof'], subtopics: ['Proof by contradiction'] },
      {
        id: 'algebra-functions',
        name: 'Algebra and functions',
        short: 'Algebra',
        matches: ['algebra and functions', 'algebra'],
        subtopics: ['Partial fractions', 'Functions: domain and range', 'Composite and inverse functions', 'Modulus functions', 'Combined transformations'],
      },
      {
        id: 'coordinate-geometry',
        name: 'Coordinate geometry in the (x, y) plane',
        short: 'Coordinate geometry',
        matches: ['coordinate geometry in the (x, y) plane', 'coordinate geometry', 'parametric equations'],
        subtopics: ['Parametric equations', 'Converting parametric and Cartesian forms', 'Modelling with parametric equations'],
      },
      {
        id: 'sequences-series',
        name: 'Sequences and series',
        short: 'Sequences & series',
        matches: ['sequences and series', 'binomial expansion'],
        subtopics: ['Arithmetic sequences and series', 'Geometric sequences and series', 'Sigma notation', 'Recurrence relations', 'Binomial expansion for any rational n'],
      },
      {
        id: 'trigonometry',
        name: 'Trigonometry',
        short: 'Trigonometry',
        matches: ['trigonometry'],
        subtopics: ['Radians, arcs and sectors', 'Small angle approximations', 'Sec, cosec and cot', 'Inverse trigonometric functions', 'Addition and double-angle formulae', 'R cos(θ ± α) form', 'Proving identities'],
      },
      {
        id: 'differentiation',
        name: 'Differentiation',
        short: 'Differentiation',
        matches: ['differentiation'],
        subtopics: ['Chain, product and quotient rules', 'Differentiating trig, exponential and log functions', 'Implicit differentiation', 'Parametric differentiation', 'Concavity and points of inflection', 'Connected rates of change'],
      },
      {
        id: 'integration',
        name: 'Integration',
        short: 'Integration',
        matches: ['integration'],
        subtopics: ['Integrating standard functions', 'Integration by substitution', 'Integration by parts', 'Partial fractions', 'Areas between curves', 'Differential equations'],
      },
      {
        id: 'numerical-methods',
        name: 'Numerical methods',
        short: 'Numerical methods',
        matches: ['numerical methods'],
        subtopics: ['Locating roots', 'Iteration', 'Newton-Raphson method', 'Trapezium rule'],
      },
      { id: 'vectors', name: 'Vectors', short: 'Vectors', matches: ['vectors'], subtopics: ['Vectors in three dimensions', 'Geometric problems in 3D'] },
    ],
  },

  'edx-stats-1': {
    id: 'edx-stats-1',
    name: 'Edexcel Statistics · Year 12',
    branch: 'statistics',
    year: '12',
    areas: [
      { id: 'sampling', name: 'Statistical sampling', short: 'Sampling', matches: ['statistical sampling', 'sampling'], subtopics: ['Populations and samples', 'Sampling methods', 'The large data set'] },
      {
        id: 'data-presentation',
        name: 'Data presentation and interpretation',
        short: 'Data presentation',
        matches: ['data presentation and interpretation', 'data presentation'],
        subtopics: ['Measures of location and spread', 'Histograms', 'Box plots and cumulative frequency', 'Outliers', 'Correlation and regression'],
      },
      { id: 'probability', name: 'Probability', short: 'Probability', matches: ['probability'], subtopics: ['Venn diagrams', 'Mutually exclusive and independent events', 'Tree diagrams'] },
      { id: 'distributions', name: 'Statistical distributions', short: 'Distributions', matches: ['statistical distributions', 'distributions'], subtopics: ['Discrete random variables', 'The binomial distribution'] },
      {
        id: 'hypothesis-testing',
        name: 'Statistical hypothesis testing',
        short: 'Hypothesis testing',
        matches: ['statistical hypothesis testing', 'hypothesis testing'],
        subtopics: ['Hypotheses and significance levels', 'Critical values and regions', 'One- and two-tailed binomial tests'],
      },
    ],
  },

  'edx-stats-2': {
    id: 'edx-stats-2',
    name: 'Edexcel Statistics · Year 13',
    branch: 'statistics',
    year: '13',
    areas: [
      {
        id: 'regression-correlation',
        name: 'Regression and correlation',
        short: 'Regression',
        matches: ['regression and correlation', 'data presentation and interpretation', 'regression'],
        subtopics: ['Exponential models and logarithms', 'Product moment correlation coefficient', 'Hypothesis tests for correlation'],
      },
      { id: 'probability', name: 'Probability', short: 'Probability', matches: ['probability', 'conditional probability'], subtopics: ['Set notation', 'Conditional probability', 'Modelling with probability'] },
      {
        id: 'distributions',
        name: 'Statistical distributions',
        short: 'Distributions',
        matches: ['statistical distributions', 'distributions', 'normal distribution'],
        subtopics: ['The normal distribution', 'Finding μ and σ', 'Normal approximation to the binomial'],
      },
      {
        id: 'hypothesis-testing',
        name: 'Statistical hypothesis testing',
        short: 'Hypothesis testing',
        matches: ['statistical hypothesis testing', 'hypothesis testing'],
        subtopics: ['Testing a normal mean', 'Testing correlation coefficients'],
      },
    ],
  },

  'edx-mech-1': {
    id: 'edx-mech-1',
    name: 'Edexcel Mechanics · Year 12',
    branch: 'mechanics',
    year: '12',
    areas: [
      { id: 'modelling', name: 'Modelling in mechanics', short: 'Modelling', matches: ['modelling in mechanics', 'quantities and units in mechanics'], subtopics: ['Modelling assumptions', 'SI units', 'Vectors in mechanics'] },
      { id: 'constant-acceleration', name: 'Constant acceleration', short: 'Constant acceleration', matches: ['constant acceleration', 'kinematics'], subtopics: ['Displacement-time and velocity-time graphs', 'SUVAT equations', 'Vertical motion under gravity'] },
      { id: 'forces-motion', name: 'Forces and motion', short: 'Forces & motion', matches: ['forces and motion', "forces and newton's laws"], subtopics: ["Newton's laws of motion", 'Resultant forces', 'Connected particles', 'Pulleys'] },
      { id: 'variable-acceleration', name: 'Variable acceleration', short: 'Variable acceleration', matches: ['variable acceleration'], subtopics: ['Functions of time', 'Using differentiation', 'Using integration', 'Maxima and minima'] },
    ],
  },

  'edx-mech-2': {
    id: 'edx-mech-2',
    name: 'Edexcel Mechanics · Year 13',
    branch: 'mechanics',
    year: '13',
    areas: [
      { id: 'moments', name: 'Moments', short: 'Moments', matches: ['moments'], subtopics: ['Resultant moments', 'Equilibrium', 'Centres of mass', 'Tilting'] },
      { id: 'forces-friction', name: 'Forces and friction', short: 'Forces & friction', matches: ['forces and friction', "forces and newton's laws"], subtopics: ['Resolving forces', 'Inclined planes', 'Friction and μ'] },
      { id: 'projectiles', name: 'Projectiles', short: 'Projectiles', matches: ['projectiles'], subtopics: ['Horizontal projection', 'Projection at any angle', 'Projectile motion formulae'] },
      { id: 'applications-forces', name: 'Applications of forces', short: 'Applications of forces', matches: ['applications of forces'], subtopics: ['Static particles', 'Limiting equilibrium', 'Ladder problems', 'Connected particles on slopes'] },
      { id: 'further-kinematics', name: 'Further kinematics', short: 'Further kinematics', matches: ['further kinematics', 'kinematics'], subtopics: ['Vectors in kinematics', 'Vector methods with projectiles', 'Variable acceleration in two dimensions'] },
    ],
  },
};

export const DEFAULT_SPEC_ID = 'edx-maths-1';

/*
Courses offered in the Skill Radar toggle, grouped by year.
TODO: replace with the courses the student is actually subscribed to once subscriptions exist.
*/
export const SUBSCRIBED_COURSES = [
  { year: 'Year 12', courses: [{ id: 'edx-maths-1', label: 'Pure' }, { id: 'edx-stats-1', label: 'Statistics' }, { id: 'edx-mech-1', label: 'Mechanics' }] },
  { year: 'Year 13', courses: [{ id: 'edx-maths-2', label: 'Pure' }, { id: 'edx-stats-2', label: 'Statistics' }, { id: 'edx-mech-2', label: 'Mechanics' }] },
];
