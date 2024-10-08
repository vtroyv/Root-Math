/*
This file provides the code implementation to compile MATHJSON/BoxedExpressions to sympy
*/

import type { MathJsonIdentifier } from "@cortex-js/compute-engine/dist/types/math-json";
import type { BoxedExpression } from "@cortex-js/compute-engine";


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
    }, 
    Arccos: 'acos', 
    Arcosh: 'acosh', 
    Arccot: ([x], compile) => {
      if (x === null) throw new Error('Arccot: no argument');
      return `acot(${compile(x)})`;
    }, 
    Arccoth: ([x], compile) => {
      if (x === null) throw new Error('Arccoth: no argument');
      return `acoth(${compile(x)})`;
    }, 
    Arccsc: ([x], compile) => {
      if (x === null) throw new Error('Arccsc: no argument');
      return `acsc(${compile(x)})`;
    }, 
    Arccsch: ([x], compile)=>{
      if (x === null) throw new Error('Arccsch: no argument');
      return `acsch(${compile})`
    }, 
    Arcsec: ([x], compile)=> {
      if (x === null) throw new Error('Arcsec: no argument');
      return `asec(${compile})`;
    },
    Arcsech: ([x], compile) => {
      if (x === null) throw new Error('Arcsech: no argument');
      return `asech(${compile})`
    }, 
    
    Arsin:  'asin', 
    Arsinh: 'asinh', 
    Arctan: 'atan',
    Artanh: 'atanh',

    // Math.cbrt

    Ceiling: 'ceiling', 
    Chop: '_SYS.chop', // use sympy utility functions like evalf()
    Cos: 'cos', 
    Cosh: 'cosh', 
    Cot: ([x], compile)=> {
      if (x === null) throw new Error('Cot: no argument');
      // return inlineExpression(`cot(${x})`, compile(x));
    }

  }

  


  export function compile(expr: BoxedExpression | undefined, target: CompileTarget, prec) {
    //expr is a boxed expression, note when we parse latex a box expression is returned, 
    // before we call the .json propoerty which gives mathjson
    //
    if (expr === undefined) return '';

    if (!expr.isValid) {
      throw new Error(`Cannot compiled invalid expression: "${expr.toString()}"`)
    }

    //
    // Is it a symbol?
    ////
    const s = expr.symbol; 
    

    // const f = expr.re
  }

  //testing this change that i wast to push to github

  
  function tempVar(): string {
    // Return a random variable name made up of a single underscore
    // followed by some digits and letters
    // Note: must skip at least the first two chars, since
    //`Math.random().toString(36)` will return a string like "0.dg26kZjalw"
    return `_${Math.random().toString(36).substring(4)}`;
  }

  //------- TYPE DEFINITIONS --------//
  export type CompileTarget ={
    operators?: (op: MathJsonIdentifier) => [op: string, prec: number]
  }


