//This object contains the the key value pairs of the mathjson operators (keys) with their value set to their corresponding
//python/sympy representation 
//It also includes there precedence levels, 
//operators with higher precedence levels are evaluated first
const NATIVE_SYMPY_OPERATORS= {
    Add: ['+', 10],           // Similar precedence to addition
    Subtract: ['-', 10],      // Similar precedence to subtraction
    Negate: ['-', 15],        // Unary negation has higher precedence
    Multiply: ['*', 20],      // Higher precedence for multiplication
    Divide: ['/', 20],        // Same as multiplication
    FloorDivide: ['//', 20],  // Same precedence as other multiplication operators
    Modulus: ['%', 20],       // Same precedence as multiplication
    Power: ['**', 30],        // Exponentiation has the highest precedence
    
    BitwiseAnd: ['&', 8],     // Lower precedence than arithmetic
    BitwiseOr: ['|', 6],      // Lower precedence than XOR
    BitwiseXor: ['^', 7],     // Between AND and OR
  
    Less: ['<', 5],           // Comparison operators
    LessEqual: ['<=', 5],
    Greater: ['>', 5],
    GreaterEqual: ['>=', 5],
    Equal: ['==', 5],         // Same precedence for all comparisons
    NotEqual: ['!=', 5],
  
    Not: ['not', 40],         // Logical NOT has a high precedence
    And: ['and', 3],          // Logical AND has lower precedence
    Or: ['or', 2],            // Logical OR has the lowest precedence
  };
  
//This code contains the key value pairs of the mathjson operators (keys)
//their values set to their corresponding python/sympy representation

  const NATIVE_SYMPY_FUNCTIONS = {
    Abs: 'Abs', 
    Add: (args, compile) => {
        if (args.length === 1) return compile(args[0]);
        return `(${args.map((x)=> compile(x)).join(' + ')})`;
    }

  }


  export function compile(expr, target, prec) {
    if (expr === undefined) return '';

    if (!expr.isValid) {
      throw new Error(`Cannot compiled invalid expression: "${expr.toString()}"`)
    }

    //
    // Is it a symbol?
    ////

    const f = expr.re
  }