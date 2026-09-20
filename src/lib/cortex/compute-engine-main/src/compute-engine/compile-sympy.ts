// import type { MathJsonIdentifier } from "../math-json";
// import type { BoxedExpression } from "./public";

// import { isRelationalOperator } from "./private";
// import { isFiniteIndexableCollection } from "./collection-utils";
// import { normalizeIndexingSet } from "./library/utils";

// import { monteCarloEstimate } from "./numerics/monte-carlo";
// import {chop, factorial, gcd, lcm, limit} from './numerics/numeric';
// import {gamma, gammaln} from './numerics/special-functions'


// // TYPE DECLARATIONS
// export type CompiledType = boolean | number | string | object; 

// type SymPySource = string;

// export type CompiledOperators = Record<
//   MathJsonIdentifier,
//   [op: string, prec: number]
// >;

// export type CompiledFunctions = {
//   [id: MathJsonIdentifier]:
//     | string
//     | ((
//         args: ReadonlyArray<BoxedExpression>,
//         compile: (expr: BoxedExpression) => SymPySource,
//         target: CompileTarget
//       ) => SymPySource);
// };






// export type CompileTarget = {
//   operators?: (op: MathJsonIdentifier) => [op: string, prec: number];
//   functions?: (
//     id: MathJsonIdentifier
//   ) => string | ((...args: CompiledType[]) => string);
//   var: (id: MathJsonIdentifier) => string | undefined;
//   string: (str: string) => string;
//   number: (n: number) => string;
//   ws: (s?: string) => string; // White space
//   indent: number;
//   // @todo: add context or return compile as an array of statements
//   // and let the caller decide how to wrap it in an IIFE.
//   // The expression being compiled will be used:
//   // - as the value of a variable declaration (LexicalDeclaration)
//   // - as the body of a function (FunctionDeclaration)
//   // context?: 'LexicalDeclaration' | 'ExpressionStatement' | 'ReturnStatement';
// };

// export class ComputeEngineFunction extends Function {
//   private sys = {
//     chop: chop,
//     factorial: factorial,
//     gamma: gamma,
//     gcd: gcd,
//     integrate: (f, a, b) => monteCarloEstimate(f, a, b, 10e6),
//     lcm: lcm,
//     lngamma: gammaln,
//     limit: limit,
//   };
//   constructor(body: string) {
//     super('_SYS', '_', `return ${body}`);
//     return new Proxy(this, {
//       apply: (target, thisArg, argumentsList) =>
//         super.apply(thisArg, [this.sys, ...argumentsList]),
//       get: (target, prop) => {
//         // Expose the `toString` method so that the JavaScript source can be
//         // inspected
//         if (prop === 'toString') return (): string => body;
//         return target[prop];
//       },
//     });
//   }
// }



// function compileLoop(
//     h: string,
//     args: ReadonlyArray<BoxedExpression>,
//     target: CompileTarget
//   ): string {
//     if (args === null) throw new Error('Sum/Product: no arguments');
//     if (!args[0]) throw new Error('Sum/Product: no body');
//     // if (!args[1]) throw new Error('Sum/Product: no limits');
  
//     const { index, lower, upper, isFinite } = normalizeIndexingSet(args[1]);
  
//     const op = h === 'Sum' ? '+' : '*';
  
//     if (!index) {
//       // Loop over a collection
//       const indexVar = tempVar();
//       const acc = tempVar();
//       const col = compile(args[0], target);
//       return `${col}.reduce((${acc}, ${indexVar}) => ${acc} ${op} ${indexVar}, ${
//         op === '+' ? '0' : '1'
//       })`;
//       //         return `(() => {
//       //   let _acc = ${op === '+' ? '0' : '1'};
//       //   for (const _x of ${col}) _acc ${op}= _x;
//       //   return _acc;
//       // })()`;
//     }
  
//     // @todo: if !isFinite, add tests for convergence to the generated code
  
//     const fn = compile(args[0], {
//       ...target,
//       var: (id) => {
//         if (id === index) return index;
//         return target.var(id);
//       },
//     });
  
//     // @todo: don't always need to wrap in an IIFE
//     const indexVar = tempVar();
//     const acc = tempVar();
  
//     return `(() => {
//     let ${acc} = ${op === '+' ? '0' : '1'};
//     let ${index} = ${lower};
//     const _fn = () => ${fn};
//     while (${indexVar} <= ${upper}) {
//       ${acc} ${op}= _fn();
//       ${indexVar}++;
//     }
//     return ${acc};
//   })()`;
//   }

  
// function compileExpr(
//     h: string, 
//     args: ReadonlyArray<BoxedExpression>,
//     prec: number, 
//     target: CompileTarget
// ) :SymPySource  {

// /*
// compileExpr is being called with the following arguments: 
// - compileExpr(expr.operator, expr.ops!, prec, target)


// - expr.operator:
// -----------------
//   -> read operator: string; 

//   -> The list of operands of the function. If the expression is not a function, return `null`. 

// - expr.ops!:
// ----------------
//   -> read ops: null | readonlyArray<BoxedExpression>;

//   -> If this expression is a function, the number of operands, otherwise 0. 

//   -> Note that a function can have 0 operands, so to check if this expression is a function, 
//      check if `this.ops !== null` instead

// - prec:
// ----------------
//     -> Ι think this means precedence 

// - target:
// -----------
//     -> target: CompileTarget
//     it's an object with the following keys, operators, functions, var, string, number, ws, indent
// */


//     if (h === 'Error') throw new Error('Error');
//     if (h === 'Sequence') {
//         /*
//         In MathJSON, a "Sequence" refers to an ordered list of expressions. 
//         It can represent a collection of items, arguments, or multiple sub-expressions. 
//         In the MathJSON format, a sequence is typically expressed as a list of expressions, 
//         following a function head like ["Sequence", expr1, expr2, ...]. 
//         This structure is used to group together expressions that need to be processed or evaluated in order. 
//         For example, a sequence of arguments to a function or a sequence of terms in an expression.
//          */
//         if (args.length === 0) return '';
//         return `(${args.map((arg) => compile(arg, target, prec)).join(', ')})`;

//     }

//     // if (h === 'Negate') {
//     //const arg = args[0];
//     //if (arg === null) return '';
//     // return `-${compile(arg, target,3)}`;
//     //}

//     if (h === 'Sum' || h === 'Product') return compileLoop(h, args, target);

//     //
//     //Is it an operator
//     //
//     //Check that none of the arguments are collections
//     //If they are, we'll treat it as a function call
//     if (args.every((x)=> !x.isCollection)) {
//         const op = target.operators?.(h);

//         if (isRelationalOperator(h) && args.length > 2 && op) {
//             // JavaScript relational operators only take two arguments
//             // We need to chain them
//             const result: string[] = [];
//             for (let i = 0; i < args.length - 1; i++)
//               result.push(compileExpr(h, [args[i], args[i + 1]], op[1], target));
      
//             return `(${result.join(') && (')})`;
//           }

//           if (op !== undefined) {
//             if (args === null) return '';
//             let resultStr: string;
//             if (args.length === 1){
//                 //Unary operator, assume prefix
//                 resultStr = `${op[0]}${compile(args[0], target, op[1])}`;
//             } else {
//                 resultStr = args
//                 .map((arg)=> compile(arg,target, op[1]))
//                 .join(`${op[0]}`);
//             }
//             return op[1] < prec ? `(${resultStr})` : resultStr;
//           }
      
//     }
//     if (h === 'Function') {
//         // Anonymous function
//         const params = args.slice(1).map((x) => x.symbol);
//         return `((${params.join(', ')}) => ${compile(args[0].canonical, {
//           ...target,
//           var: (id) => (params.includes(id) ? id : target.var(id)),
//         })})`;
//       }
    
//       if (h === 'Declare') return `let ${args[0].symbol}`;
//       if (h === 'Assign') return `${args[0].symbol} = ${compile(args[1], target)}`;
//       // @todo: that's incorrect: return should return from the function, not the block
//       if (h === 'Return') return `return ${compile(args[0], target)}`;
//       if (h === 'If') {
//         if (args.length !== 3) throw new Error('If: wrong number of arguments');
//         return `((${compile(args[0], target)}) ? (${compile(
//           args[1],
//           target
//         )}) : (${compile(args[2], target)}))`;
//       }
    
//       if (h === 'Block') {
//         // Get all the Declare statements
//         const locals: string[] = [];
//         for (const arg of args) {
//           if (arg.operator === 'Declare') locals.push(arg.ops![0].symbol!);
//         }
    
//         if (args.length === 1 && locals.length === 0)
//           return compile(args[0], target);
    
//         const result = args.map((arg) =>
//           compile(arg, {
//             ...target,
//             var: (id) => {
//               if (locals.includes(id)) return id;
//               return target.var(id);
//             },
//           })
//         );
//         // Add a return statement to the last expression
//         result[result.length - 1] = `return ${result[result.length - 1]}`;
//         return `(() => {${target.ws('\n')}${result.join(
//           `;${target.ws('\n')}`
//         )}${target.ws('\n')}})()`;
//       }
    
//       const fn = target.functions?.(h);
//       if (!fn) throw new Error(`Unknown function ${h}`);
//       if (typeof fn === 'function') {
//         if (args.length === 1 && isFiniteIndexableCollection(args[0])) {
//           const v = tempVar();
//           return `(${compile(args[0], target)}).map((${v}) => ${fn(
//             args[0].engine.box(v),
//             (expr) => compile(expr, target)
//           )})`;
//         }
//         return fn(args, (expr) => compile(expr, target), target);
//       }
    
//       if (args === null) return `${fn}()`;
    
//       if (args.length === 1 && isFiniteIndexableCollection(args[0])) {
//         const v = tempVar();
//         return `(${compile(args[0], target)}).map((${v}) => ${fn}(${compile(
//           args[0].engine.box(v),
//           target
//         )}))`;
//       }
    
//       return `${fn}(${args.map((x) => compile(x, target)).join(', ')})`;
// }



// export function compile(
//     expr: BoxedExpression | undefined, 
//     target: CompileTarget, 
//     prec = 0) : SymPySource  {
//         if (expr === undefined) return '';
//         if(!expr.isValid) {
//             throw new Error(`Cannot compile invalid expression: "${expr.toString()}"`);
//         }
//         //
//         //Is it a symbol?
//         //

//         /*
//         A symbol is an identifier representing a named mathematical object. It belongs to a domain and it may hold a value. 
//         A symbol without a value represents a matehmatical unknown in an expression. 
//         note we can add definitions of symbols to the compute engine. e.g. 'Pi' is the symbol for 3.14.. π

//         if s is not null, the condition will be false, and the code inside the if block will not execute

//         a) target.var?.(s) this is optional chaining (?.). It attempts to call the function target.var(s) if target.var exists
//         - if target.var is undefined or null, the expression will return undefined and will not throw an error
//         - if target.var exists and is a function, it will call that function, passing s as the argument 

//         b) ?? s 
//         - the nullish coaliescing operator (??) checks if the left-hand side is null or undefined
//         -if target.var?.(s) results in undefeind or null, then ?? will fallback to the right-hand side, which is s.
//         */
//         const s = expr.symbol;
//         if (s !== null) return target.var?.(s) ?? s



//         //
//         //Is it a number?
//         //

//         const f = expr.re;

//         if (!isNaN(f)) {
//             if (expr.im !== 0) throw new Error('Complex numbers are not supported');
//             return target.number(f);
//         }

//         //Is it a string?
//         const str = expr.string;
//         /*
//         - This condition checks if the variable str is not null
//         - return target.string(s!): this line assumes that target.string is a function,
//         - s! the ! is a non-null assertion operator in typescript, it tells the typescript compiler that you are confident s 
//         is not null or undefined, even if the type system thinks it might be. 
        
//         - In other words it's saying trust me, s will never be null or undefined here, so dont worry about it
//         - this operator is typically used when you're sure that a vlaue exists, but typescript's static type-checking is still being cautious
//          */
//         if(str !== null) return target.string(s!); 

//         //It must be a function expression... 
//         return compileExpr(expr.operator /* list of operators in the function*/, expr.ops!, prec, target); 

//     }

// export function compileToTarget(expr: BoxedExpression,
//      target: CompileTarget
//     ): ((_:Record<string, CompiledType>) => CompiledType) | undefined {
//     const sympy =  compile(expr, target);
 

//     return new ComputeEngineFunction(sympy) as unknown as () => CompiledType; 
   
// }




// function tempVar(): string {
//     //Return a random variable name made up of a single underscore
//     //followed by some digits and letters
//     //Note: must skip at least the first two chars, since 
//     //`Math.random().toString(36)` wil return a string like "0.dg26kZjalw"

//     return `_${Math.random().toString(36).substring(4)}`
// }