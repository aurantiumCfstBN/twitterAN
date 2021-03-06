"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
var Option_1 = require("./Option");
var Ord_1 = require("./Ord");
var Setoid_1 = require("./Setoid");
exports.URI = 'Array';
/**
 *
 * @example
 * import { getMonoid } from 'fp-ts/lib/Array'
 *
 * const M = getMonoid<number>()
 * assert.deepEqual(M.concat([1, 2], [3, 4]), [1, 2, 3, 4])
 *
 * @function
 * @since 1.0.0
 */
exports.getMonoid = function () {
    return {
        concat: function_1.concat,
        empty: exports.empty
    };
};
/**
 * Derives a Setoid over the Array of a given element type from the Setoid of that type. The derived setoid defines two
 * arrays as equal if all elements of both arrays are compared equal pairwise with the given setoid `S`. In case of
 * arrays of different lengths, the result is non equality.
 *
 *
 * @example
 * import { ordString } from 'fp-ts/lib/Ord'
 *
 * const O = getArraySetoid(ordString)
 * assert.strictEqual(O.equals(['a', 'b'], ['a', 'b']), true)
 * assert.strictEqual(O.equals(['a'], []), false)
 *
 * @constant
 * @since 1.0.0
 */
exports.getSetoid = Setoid_1.getArraySetoid;
/**
 * Derives an `Ord` over the Array of a given element type from the `Ord` of that type. The ordering between two such
 * arrays is equal to: the first non equal comparison of each arrays elements taken pairwise in increasing order, in
 * case of equality over all the pairwise elements; the longest array is considered the greatest, if both arrays have
 * the same length, the result is equality.
 *
 *
 * @example
 * import { getOrd } from 'fp-ts/lib/Array'
 * import { ordString } from 'fp-ts/lib/Ord'
 *
 * const O = getOrd(ordString)
 * assert.strictEqual(O.compare(['b'], ['a']), 1)
 * assert.strictEqual(O.compare(['a'], ['a']), 0)
 * assert.strictEqual(O.compare(['a'], ['b']), -1)
 *
 * @function
 * @since 1.2.0
 */
exports.getOrd = function (O) {
    return __assign({}, exports.getSetoid(O), { compare: function (a, b) {
            var aLen = a.length;
            var bLen = b.length;
            var len = Math.min(aLen, bLen);
            for (var i = 0; i < len; i++) {
                var order = O.compare(a[i], b[i]);
                if (order !== 0) {
                    return order;
                }
            }
            return Ord_1.ordNumber.compare(aLen, bLen);
        } });
};
var map = function (fa, f) {
    return fa.map(function (a) { return f(a); });
};
var mapWithIndex = function (fa, f) {
    return fa.map(function (a, i) { return f(i, a); });
};
var of = function (a) {
    return [a];
};
var ap = function (fab, fa) {
    return exports.flatten(map(fab, function (f) { return map(fa, f); }));
};
var chain = function (fa, f) {
    var resLen = 0;
    var l = fa.length;
    var temp = new Array(l);
    for (var i = 0; i < l; i++) {
        var e = fa[i];
        var arr = f(e);
        resLen += arr.length;
        temp[i] = arr;
    }
    var r = Array(resLen);
    var start = 0;
    for (var i = 0; i < l; i++) {
        var arr = temp[i];
        var l_1 = arr.length;
        for (var j = 0; j < l_1; j++) {
            r[j + start] = arr[j];
        }
        start += l_1;
    }
    return r;
};
var reduce = function (fa, b, f) {
    return reduceWithIndex(fa, b, function (_, b, a) { return f(b, a); });
};
var foldMap = function (M) {
    var foldMapWithIndexM = foldMapWithIndex(M);
    return function (fa, f) { return foldMapWithIndexM(fa, function (_, a) { return f(a); }); };
};
var reduceRight = function (fa, b, f) {
    return foldrWithIndex(fa, b, function (_, a, b) { return f(a, b); });
};
var reduceWithIndex = function (fa, b, f) {
    var l = fa.length;
    var r = b;
    for (var i = 0; i < l; i++) {
        r = f(i, r, fa[i]);
    }
    return r;
};
var foldMapWithIndex = function (M) { return function (fa, f) {
    return fa.reduce(function (b, a, i) { return M.concat(b, f(i, a)); }, M.empty);
}; };
var foldrWithIndex = function (fa, b, f) {
    return fa.reduceRight(function (b, a, i) { return f(i, a, b); }, b);
};
function traverse(F) {
    var traverseWithIndexF = traverseWithIndex(F);
    return function (ta, f) { return traverseWithIndexF(ta, function (_, a) { return f(a); }); };
}
exports.traverse = traverse;
var sequence = function (F) { return function (ta) {
    return reduce(ta, F.of(zero()), function (fas, fa) { return F.ap(F.map(fas, function (as) { return function (a) { return exports.snoc(as, a); }; }), fa); });
}; };
/**
 * An empty array
 *
 * @constant
 * @since 1.9.0
 */
exports.empty = [];
var zero = function () { return exports.empty; };
var alt = function_1.concat;
var unfoldr = function (b, f) {
    var ret = [];
    var bb = b;
    while (true) {
        var mt = f(bb);
        if (mt.isSome()) {
            var _a = mt.value, a = _a[0], b_1 = _a[1];
            ret.push(a);
            bb = b_1;
        }
        else {
            break;
        }
    }
    return ret;
};
/**
 * Return a list of length `n` with element `i` initialized with `f(i)`
 *
 * @example
 * import { makeBy } from 'fp-ts/lib/Array'
 *
 * const double = (n: number): number => n * 2
 * assert.deepEqual(makeBy(5, double), [0, 2, 4, 6, 8])
 *
 * @function
 * @since 1.10.0
 */
exports.makeBy = function (n, f) {
    var r = [];
    for (var i = 0; i < n; i++) {
        r.push(f(i));
    }
    return r;
};
/**
 * Create an array containing a range of integers, including both endpoints
 *
 * @example
 * import { range } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(range(1, 5), [1, 2, 3, 4, 5])
 *
 * @function
 * @since 1.10.0
 */
exports.range = function (start, end) {
    return exports.makeBy(end - start + 1, function (i) { return start + i; });
};
/**
 * Create an array containing a value repeated the specified number of times
 *
 * @example
 * import { replicate } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(replicate(3, 'a'), ['a', 'a', 'a'])
 *
 * @function
 * @since 1.10.0
 */
exports.replicate = function (n, a) {
    return exports.makeBy(n, function () { return a; });
};
var extend = function (fa, f) {
    return fa.map(function (_, i, as) { return f(as.slice(i)); });
};
/**
 * Removes one level of nesting
 *
 * @example
 * import { flatten } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(flatten([[1], [2], [3]]), [1, 2, 3])
 *
 * @function
 * @since 1.0.0
 */
exports.flatten = function (ffa) {
    var rLen = 0;
    var len = ffa.length;
    for (var i = 0; i < len; i++) {
        rLen += ffa[i].length;
    }
    var r = Array(rLen);
    var start = 0;
    for (var i = 0; i < len; i++) {
        var arr = ffa[i];
        var l = arr.length;
        for (var j = 0; j < l; j++) {
            r[j + start] = arr[j];
        }
        start += l;
    }
    return r;
};
/**
 * Break an array into its first element and remaining elements
 *
 * @example
 * import { fold } from 'fp-ts/lib/Array'
 *
 * const len = <A>(as: Array<A>): number => fold(as, 0, (_, tail) => 1 + len(tail))
 * assert.strictEqual(len([1, 2, 3]), 3)
 *
 * @function
 * @since 1.0.0
 */
exports.fold = function (as, b, cons) {
    return exports.isEmpty(as) ? b : cons(as[0], as.slice(1));
};
/**
 * Lazy version of {@link fold}
 * @function
 * @since 1.0.0
 */
exports.foldL = function (as, nil, cons) {
    return exports.isEmpty(as) ? nil() : cons(as[0], as.slice(1));
};
/**
 * Break an array into its initial elements and the last element
 * @function
 * @since 1.7.0
 * @param as
 * @param b
 * @param cons
 */
exports.foldr = function (as, b, cons) {
    return exports.isEmpty(as) ? b : cons(as.slice(0, as.length - 1), as[as.length - 1]);
};
/**
 * Lazy version of {@link foldr}
 * @function
 * @since 1.7.0
 * @param as
 * @param nil
 * @param cons
 */
exports.foldrL = function (as, nil, cons) {
    return exports.isEmpty(as) ? nil() : cons(as.slice(0, as.length - 1), as[as.length - 1]);
};
/**
 * Same as `reduce` but it carries over the intermediate steps
 *
 * ```ts
 * import { scanLeft } from 'fp-ts/lib/Array'
 *
 * scanLeft([1, 2, 3], 10, (b, a) => b - a) // [ 10, 9, 7, 4 ]
 * ```
 *
 * @function
 * @since 1.1.0
 */
exports.scanLeft = function (as, b, f) {
    var l = as.length;
    var r = new Array(l + 1);
    r[0] = b;
    for (var i = 0; i < l; i++) {
        r[i + 1] = f(r[i], as[i]);
    }
    return r;
};
/**
 * Fold an array from the right, keeping all intermediate results instead of only the final result
 *
 * @example
 * import { scanRight } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(scanRight([1, 2, 3], 10, (a, b) => b - a), [ 4, 5, 7, 10 ])
 *
 * @function
 * @since 1.1.0
 */
exports.scanRight = function (as, b, f) {
    var l = as.length;
    var r = new Array(l + 1);
    r[l] = b;
    for (var i = l - 1; i >= 0; i--) {
        r[i] = f(as[i], r[i + 1]);
    }
    return r;
};
/**
 * Test whether an array is empty
 *
 * @example
 * import { isEmpty } from 'fp-ts/lib/Array'
 *
 * assert.strictEqual(isEmpty([]), true)
 *
 * @function
 * @since 1.0.0
 */
exports.isEmpty = function (as) {
    return as.length === 0;
};
/**
 * Test whether an array contains a particular index
 * @function
 * @since 1.0.0
 */
exports.isOutOfBound = function (i, as) {
    return i < 0 || i >= as.length;
};
/**
 * This function provides a safe way to read a value at a particular index from an array
 *
 * @example
 * import { index } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * assert.deepEqual(index(1, [1, 2, 3]), some(2))
 * assert.deepEqual(index(3, [1, 2, 3]), none)
 *
 * @function
 * @since 1.0.0
 */
exports.index = function (i, as) {
    return exports.isOutOfBound(i, as) ? Option_1.none : Option_1.some(as[i]);
};
/**
 * Attaches an element to the front of an array, creating a new array
 *
 * @example
 * import { cons } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(cons(0, [1, 2, 3]), [0, 1, 2, 3])
 *
 * @function
 * @since 1.0.0
 */
exports.cons = function (a, as) {
    var len = as.length;
    var r = Array(len + 1);
    for (var i = 0; i < len; i++) {
        r[i + 1] = as[i];
    }
    r[0] = a;
    return r;
};
/**
 * Append an element to the end of an array, creating a new array
 *
 * @example
 * import { snoc } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(snoc([1, 2, 3], 4), [1, 2, 3, 4])
 *
 * @function
 * @since 1.0.0
 */
exports.snoc = function (as, a) {
    var len = as.length;
    var r = Array(len + 1);
    for (var i = 0; i < len; i++) {
        r[i] = as[i];
    }
    r[len] = a;
    return r;
};
/**
 * Get the first element in an array, or `None` if the array is empty
 *
 * @example
 * import { head } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * assert.deepEqual(head([1, 2, 3]), some(1))
 * assert.deepEqual(head([]), none)
 *
 * @function
 * @since 1.0.0
 */
exports.head = function (as) {
    return exports.isEmpty(as) ? Option_1.none : Option_1.some(as[0]);
};
/**
 * Get the last element in an array, or `None` if the array is empty
 *
 * @example
 * import { last } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * assert.deepEqual(last([1, 2, 3]), some(3))
 * assert.deepEqual(last([]), none)
 *
 * @function
 * @since 1.0.0
 */
exports.last = function (as) {
    return exports.index(as.length - 1, as);
};
/**
 * Get all but the first element of an array, creating a new array, or `None` if the array is empty
 *
 * @example
 * import { tail } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * assert.deepEqual(tail([1, 2, 3]), some([2, 3]))
 * assert.deepEqual(tail([]), none)
 *
 * @function
 * @since 1.0.0
 */
exports.tail = function (as) {
    return exports.isEmpty(as) ? Option_1.none : Option_1.some(as.slice(1));
};
/**
 * Get all but the last element of an array, creating a new array, or `None` if the array is empty
 *
 * @example
 * import { init } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * assert.deepEqual(init([1, 2, 3]), some([1, 2]))
 * assert.deepEqual(init([]), none)
 *
 * @function
 * @since 1.0.0
 */
exports.init = function (as) {
    var len = as.length;
    return len === 0 ? Option_1.none : Option_1.some(as.slice(0, len - 1));
};
/**
 * Keep only a number of elements from the start of an array, creating a new array.
 * `n` must be a natural number
 *
 * @example
 * import { take } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(take(2, [1, 2, 3]), [1, 2])
 *
 * @function
 * @since 1.0.0
 */
exports.take = function (n, as) {
    return as.slice(0, n);
};
/**
 * Keep only a number of elements from the end of an array, creating a new array.
 * `n` must be a natural number
 *
 * @example
 * import { takeEnd } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(takeEnd(2, [1, 2, 3, 4, 5]), [4, 5])
 *
 * @function
 * @since 1.10.0
 */
exports.takeEnd = function (n, as) {
    return n === 0 ? exports.empty : as.slice(-n);
};
function takeWhile(as, predicate) {
    var i = spanIndexUncurry(as, predicate);
    var init = Array(i);
    for (var j = 0; j < i; j++) {
        init[j] = as[j];
    }
    return init;
}
exports.takeWhile = takeWhile;
var spanIndexUncurry = function (as, predicate) {
    var l = as.length;
    var i = 0;
    for (; i < l; i++) {
        if (!predicate(as[i])) {
            break;
        }
    }
    return i;
};
function span(as, predicate) {
    var i = spanIndexUncurry(as, predicate);
    var init = Array(i);
    for (var j = 0; j < i; j++) {
        init[j] = as[j];
    }
    var l = as.length;
    var rest = Array(l - i);
    for (var j = i; j < l; j++) {
        rest[j - i] = as[j];
    }
    return { init: init, rest: rest };
}
exports.span = span;
/**
 * Drop a number of elements from the start of an array, creating a new array
 *
 * @example
 * import { drop } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(drop(2, [1, 2, 3]), [3])
 *
 * @function
 * @since 1.0.0
 */
exports.drop = function (n, as) {
    return as.slice(n, as.length);
};
/**
 * Drop a number of elements from the end of an array, creating a new array
 *
 * @example
 * import { dropEnd } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(dropEnd(2, [1, 2, 3, 4, 5]), [1, 2, 3])
 *
 * @function
 * @since 1.10.0
 */
exports.dropEnd = function (n, as) {
    return as.slice(0, as.length - n);
};
/**
 * Remove the longest initial subarray for which all element satisfy the specified predicate, creating a new array
 *
 * @example
 * import { dropWhile } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(dropWhile([1, 3, 2, 4, 5], n => n % 2 === 1), [2, 4, 5])
 *
 * @function
 * @since 1.0.0
 */
exports.dropWhile = function (as, predicate) {
    var i = spanIndexUncurry(as, predicate);
    var l = as.length;
    var rest = Array(l - i);
    for (var j = i; j < l; j++) {
        rest[j - i] = as[j];
    }
    return rest;
};
/**
 * Find the first index for which a predicate holds
 *
 * @example
 * import { findIndex } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * assert.deepEqual(findIndex([1, 2, 3], x => x === 2), some(1))
 * assert.deepEqual(findIndex([], x => x === 2), none)
 *
 * @function
 * @since 1.0.0
 */
exports.findIndex = function (as, predicate) {
    var len = as.length;
    for (var i = 0; i < len; i++) {
        if (predicate(as[i])) {
            return Option_1.some(i);
        }
    }
    return Option_1.none;
};
function findFirst(as, predicate) {
    var len = as.length;
    for (var i = 0; i < len; i++) {
        if (predicate(as[i])) {
            return Option_1.some(as[i]);
        }
    }
    return Option_1.none;
}
exports.findFirst = findFirst;
function findLast(as, predicate) {
    var len = as.length;
    for (var i = len - 1; i >= 0; i--) {
        if (predicate(as[i])) {
            return Option_1.some(as[i]);
        }
    }
    return Option_1.none;
}
exports.findLast = findLast;
/**
 * Returns the index of the last element of the list which matches the predicate
 *
 * @example
 * import { findLastIndex } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * interface X {
 *   a: number
 *   b: number
 * }
 * const xs: Array<X> = [{ a: 1, b: 0 }, { a: 1, b: 1 }]
 * assert.deepEqual(findLastIndex(xs, x => x.a === 1), some(1))
 * assert.deepEqual(findLastIndex(xs, x => x.a === 4), none)
 *
 * @function
 * @since 1.10.0
 */
exports.findLastIndex = function (as, predicate) {
    var len = as.length;
    for (var i = len - 1; i >= 0; i--) {
        if (predicate(as[i])) {
            return Option_1.some(i);
        }
    }
    return Option_1.none;
};
/**
 * Use {@link filter} instead
 * @function
 * @since 1.0.0
 * @deprecated
 */
exports.refine = function (as, refinement) {
    return filter(as, refinement);
};
/**
 * @function
 * @since 1.0.0
 */
exports.copy = function (as) {
    var l = as.length;
    var r = Array(l);
    for (var i = 0; i < l; i++) {
        r[i] = as[i];
    }
    return r;
};
/**
 * @function
 * @since 1.0.0
 */
exports.unsafeInsertAt = function (i, a, as) {
    var xs = exports.copy(as);
    xs.splice(i, 0, a);
    return xs;
};
/**
 * Insert an element at the specified index, creating a new array, or returning `None` if the index is out of bounds
 *
 * @example
 * import { insertAt } from 'fp-ts/lib/Array'
 * import { some } from 'fp-ts/lib/Option'
 *
 * assert.deepEqual(insertAt(2, 5, [1, 2, 3, 4]), some([1, 2, 5, 3, 4]))
 *
 * @function
 * @since 1.0.0
 */
exports.insertAt = function (i, a, as) {
    return i < 0 || i > as.length ? Option_1.none : Option_1.some(exports.unsafeInsertAt(i, a, as));
};
/**
 * @function
 * @since 1.0.0
 */
exports.unsafeUpdateAt = function (i, a, as) {
    var xs = exports.copy(as);
    xs[i] = a;
    return xs;
};
/**
 * Change the element at the specified index, creating a new array, or returning `None` if the index is out of bounds
 *
 * @example
 * import { updateAt } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * assert.deepEqual(updateAt(1, 1, [1, 2, 3]), some([1, 1, 3]))
 * assert.deepEqual(updateAt(1, 1, []), none)
 *
 * @function
 * @since 1.0.0
 */
exports.updateAt = function (i, a, as) {
    return exports.isOutOfBound(i, as) ? Option_1.none : Option_1.some(exports.unsafeUpdateAt(i, a, as));
};
/**
 * @function
 * @since 1.0.0
 */
exports.unsafeDeleteAt = function (i, as) {
    var xs = exports.copy(as);
    xs.splice(i, 1);
    return xs;
};
/**
 * Delete the element at the specified index, creating a new array, or returning `None` if the index is out of bounds
 *
 * @example
 * import { deleteAt } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * assert.deepEqual(deleteAt(0, [1, 2, 3]), some([2, 3]))
 * assert.deepEqual(deleteAt(1, []), none)
 *
 * @function
 * @since 1.0.0
 */
exports.deleteAt = function (i, as) {
    return exports.isOutOfBound(i, as) ? Option_1.none : Option_1.some(exports.unsafeDeleteAt(i, as));
};
/**
 * Apply a function to the element at the specified index, creating a new array, or returning `None` if the index is out
 * of bounds
 *
 * @example
 * import { modifyAt } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * const double = (x: number): number => x * 2
 * assert.deepEqual(modifyAt([1, 2, 3], 1, double), some([1, 4, 3]))
 * assert.deepEqual(modifyAt([], 1, double), none)
 *
 * @function
 * @since 1.0.0
 */
exports.modifyAt = function (as, i, f) {
    return exports.isOutOfBound(i, as) ? Option_1.none : Option_1.some(exports.unsafeUpdateAt(i, f(as[i]), as));
};
/**
 * Reverse an array, creating a new array
 *
 * @example
 * import { reverse } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(reverse([1, 2, 3]), [3, 2, 1])
 *
 * @function
 * @since 1.0.0
 */
exports.reverse = function (as) {
    return exports.copy(as).reverse();
};
/**
 * Extracts from an array of `Either` all the `Right` elements. All the `Right` elements are extracted in order
 *
 * @example
 * import { rights } from 'fp-ts/lib/Array'
 * import { right, left } from 'fp-ts/lib/Either'
 *
 * assert.deepEqual(rights([right(1), left('foo'), right(2)]), [1, 2])
 *
 * @function
 * @since 1.0.0
 */
exports.rights = function (as) {
    var r = [];
    var len = as.length;
    for (var i = 0; i < len; i++) {
        var a = as[i];
        if (a.isRight()) {
            r.push(a.value);
        }
    }
    return r;
};
/**
 * Extracts from an array of `Either` all the `Left` elements. All the `Left` elements are extracted in order
 *
 * @example
 * import { lefts } from 'fp-ts/lib/Array'
 * import { left, right } from 'fp-ts/lib/Either'
 *
 * assert.deepEqual(lefts([right(1), left('foo'), right(2)]), ['foo'])
 *
 * @function
 * @since 1.0.0
 */
exports.lefts = function (as) {
    var r = [];
    var len = as.length;
    for (var i = 0; i < len; i++) {
        var a = as[i];
        if (a.isLeft()) {
            r.push(a.value);
        }
    }
    return r;
};
/**
 * Sort the elements of an array in increasing order, creating a new array
 *
 * @example
 * import { sort } from 'fp-ts/lib/Array'
 * import { ordNumber } from 'fp-ts/lib/Ord'
 *
 * assert.deepEqual(sort(ordNumber)([3, 2, 1]), [1, 2, 3])
 *
 * @function
 * @since 1.0.0
 */
exports.sort = function (O) { return function (as) {
    return exports.copy(as).sort(O.compare);
}; };
/**
 * Apply a function to pairs of elements at the same index in two arrays, collecting the results in a new array. If one
 * input array is short, excess elements of the longer array are discarded.
 *
 * @example
 * import { zipWith } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(zipWith([1, 2, 3], ['a', 'b', 'c', 'd'], (n, s) => s + n), ['a1', 'b2', 'c3'])
 *
 * @function
 * @since 1.0.0
 */
exports.zipWith = function (fa, fb, f) {
    var fc = [];
    var len = Math.min(fa.length, fb.length);
    for (var i = 0; i < len; i++) {
        fc[i] = f(fa[i], fb[i]);
    }
    return fc;
};
/**
 * Takes two arrays and returns an array of corresponding pairs. If one input array is short, excess elements of the
 * longer array are discarded
 *
 * @example
 * import { zip } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(zip([1, 2, 3], ['a', 'b', 'c', 'd']), [[1, 'a'], [2, 'b'], [3, 'c']])
 *
 * @function
 * @since 1.0.0
 */
exports.zip = function (fa, fb) {
    return exports.zipWith(fa, fb, function_1.tuple);
};
/**
 * Rotate an array to the right by `n` steps
 *
 * @example
 * import { rotate } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(rotate(2, [1, 2, 3, 4, 5]), [4, 5, 1, 2, 3])
 *
 * @function
 * @since 1.0.0
 */
exports.rotate = function (n, xs) {
    var len = xs.length;
    if (n === 0 || len <= 1 || len === Math.abs(n)) {
        return xs;
    }
    else if (n < 0) {
        return exports.rotate(len + n, xs);
    }
    else {
        return xs.slice(-n).concat(xs.slice(0, len - n));
    }
};
/**
 * Test if a value is a member of an array. Takes a `Setoid<A>` as a single
 * argument which returns the function to use to search for a value of type `A` in
 * an array of type `Array<A>`.
 *
 * @example
 * import { member } from 'fp-ts/lib/Array'
 * import { setoidString, setoidNumber } from 'fp-ts/lib/Setoid'
 *
 * assert.strictEqual(member(setoidString)(['thing one', 'thing two', 'cat in the hat'], 'thing two'), true)
 * assert.strictEqual(member(setoidNumber)([1, 2, 3], 1), true)
 * assert.strictEqual(member(setoidNumber)([1, 2, 3], 4), false)
 *
 * @function
 * @since 1.3.0
 */
exports.member = function (S) { return function (as, a) {
    var predicate = function (e) { return S.equals(e, a); };
    var i = 0;
    var len = as.length;
    for (; i < len; i++) {
        if (predicate(as[i])) {
            return true;
        }
    }
    return false;
}; };
/**
 * Remove duplicates from an array, keeping the first occurance of an element.
 *
 * @example
 * import { uniq } from 'fp-ts/lib/Array'
 * import { setoidNumber } from 'fp-ts/lib/Setoid'
 *
 * assert.deepEqual(uniq(setoidNumber)([1, 2, 1]), [1, 2])
 *
 * @function
 * @since 1.3.0
 */
exports.uniq = function (S) {
    var memberS = exports.member(S);
    return function (as) {
        var r = [];
        var len = as.length;
        var i = 0;
        for (; i < len; i++) {
            var a = as[i];
            if (!memberS(r, a)) {
                r.push(a);
            }
        }
        return len === r.length ? as : r;
    };
};
/**
 * Sort the elements of an array in increasing order, where elements are compared using first `ords[0]`, then `ords[1]`,
 * etc...
 *
 * @example
 * import { sortBy } from 'fp-ts/lib/Array'
 * import { contramap, ordString, ordNumber } from 'fp-ts/lib/Ord'
 *
 * interface Person {
 *   name: string
 *   age: number
 * }
 * const byName = contramap((p: Person) => p.name, ordString)
 * const byAge = contramap((p: Person) => p.age, ordNumber)
 *
 * const sortByNameByAge = sortBy([byName, byAge])
 *
 * if (sortByNameByAge.isSome()) {
 *   const persons = [{ name: 'a', age: 1 }, { name: 'b', age: 3 }, { name: 'c', age: 2 }, { name: 'b', age: 2 }]
 *   assert.deepEqual(sortByNameByAge.value(persons), [
 *     { name: 'a', age: 1 },
 *     { name: 'b', age: 2 },
 *     { name: 'b', age: 3 },
 *     { name: 'c', age: 2 }
 *   ])
 * }
 *
 * @function
 * @since 1.3.0
 */
exports.sortBy = function (ords) {
    return exports.fold(ords, Option_1.none, function (head, tail) { return Option_1.some(exports.sortBy1(head, tail)); });
};
/**
 * Non failing version of {@link sortBy}
 * @example
 * import { sortBy1 } from 'fp-ts/lib/Array'
 * import { contramap, ordString, ordNumber } from 'fp-ts/lib/Ord'
 *
 * interface Person {
 *   name: string
 *   age: number
 * }
 * const byName = contramap((p: Person) => p.name, ordString)
 * const byAge = contramap((p: Person) => p.age, ordNumber)
 *
 * const sortByNameByAge = sortBy1(byName, [byAge])
 *
 * const persons = [{ name: 'a', age: 1 }, { name: 'b', age: 3 }, { name: 'c', age: 2 }, { name: 'b', age: 2 }]
 * assert.deepEqual(sortByNameByAge(persons), [
 *   { name: 'a', age: 1 },
 *   { name: 'b', age: 2 },
 *   { name: 'b', age: 3 },
 *   { name: 'c', age: 2 }
 * ])
 *
 * @function
 * @since 1.3.0
 */
exports.sortBy1 = function (head, tail) {
    return exports.sort(tail.reduce(Ord_1.getSemigroup().concat, head));
};
/**
 * Apply a function to each element in an array, keeping only the results which contain a value, creating a new array.
 *
 * Alias of {@link Filterable}'s `filterMap`
 *
 * @example
 * import { mapOption } from 'fp-ts/lib/Array'
 * import { Option, some, none } from 'fp-ts/lib/Option'
 *
 * const f = (n: number): Option<number> => (n % 2 === 0 ? none : some(n))
 * assert.deepEqual(mapOption([1, 2, 3], f), [1, 3])
 *
 * @function
 * @since 1.0.0
 */
exports.mapOption = function (as, f) {
    return filterMapWithIndex(as, function (_, a) { return f(a); });
};
/**
 * Filter an array of optional values, keeping only the elements which contain a value, creating a new array.
 *
 * Alias of {@link Compactable}'s `compact`
 *
 * @example
 * import { catOptions } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * assert.deepEqual(catOptions([some(1), none, some(3)]), [1, 3])
 *
 * @function
 * @since 1.0.0
 */
exports.catOptions = function (as) {
    return exports.mapOption(as, function_1.identity);
};
/**
 * @example
 * import { array } from 'fp-ts/lib/Array'
 * import { left, right } from 'fp-ts/lib/Either'
 * import { identity } from 'fp-ts/lib/function'
 *
 * assert.deepEqual(array.partitionMap([right(1), left('foo'), right(2)], identity), { left: ['foo'], right: [1, 2] })
 *
 * @function
 * @since 1.0.0
 */
exports.partitionMap = function (fa, f) {
    return partitionMapWithIndex(fa, function (_, a) { return f(a); });
};
function filter(as, predicate) {
    return as.filter(predicate);
}
exports.filter = filter;
function partition(fa, p) {
    return partitionWithIndex(fa, function (_, a) { return p(a); });
}
exports.partition = partition;
var compact = exports.catOptions;
var separate = function (fa) {
    var left = [];
    var right = [];
    for (var _i = 0, fa_1 = fa; _i < fa_1.length; _i++) {
        var e = fa_1[_i];
        if (e.isLeft()) {
            left.push(e.value);
        }
        else {
            right.push(e.value);
        }
    }
    return {
        left: left,
        right: right
    };
};
var filterMap = exports.mapOption;
var wither = function (F) {
    var traverseF = traverse(F);
    return function (wa, f) { return F.map(traverseF(wa, f), compact); };
};
var wilt = function (F) {
    var traverseF = traverse(F);
    return function (wa, f) { return F.map(traverseF(wa, f), separate); };
};
/**
 * A useful recursion pattern for processing an array to produce a new array, often used for "chopping" up the input
 * array. Typically chop is called with some function that will consume an initial prefix of the array and produce a
 * value and the rest of the array.
 *
 * @example
 * import { Setoid, setoidNumber } from 'fp-ts/lib/Setoid'
 * import { chop, span } from 'fp-ts/lib/Array'
 *
 * const group = <A>(S: Setoid<A>) => (as: Array<A>): Array<Array<A>> => {
 *   return chop(as, as => {
 *     const { init, rest } = span(as, a => S.equals(a, as[0]))
 *     return [init, rest]
 *   })
 * }
 * assert.deepEqual(group(setoidNumber)([1, 1, 2, 3, 3, 4]), [[1, 1], [2], [3, 3], [4]])
 *
 * @function
 * @since 1.10.0
 */
exports.chop = function (as, f) {
    var result = [];
    var cs = as;
    while (cs.length > 0) {
        var _a = f(cs), b = _a[0], c = _a[1];
        result.push(b);
        cs = c;
    }
    return result;
};
/**
 * Splits an array into two pieces, the first piece has `n` elements.
 *
 * @example
 * import { split } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(split(2, [1, 2, 3, 4, 5]), [[1, 2], [3, 4, 5]])
 *
 * @function
 * @since 1.10.0
 */
exports.split = function (n, as) {
    return [as.slice(0, n), as.slice(n)];
};
/**
 * Splits an array into length-`n` pieces. The last piece will be shorter if `n` does not evenly divide the length of
 * the array. Note that `chunksOf([], n)` is `[]`, not `[[]]`. This is intentional, and is consistent with a recursive
 * definition of `chunksOf`; it satisfies the property that
 *
 * ```ts
 * chunksOf(xs, n).concat(chunksOf(ys, n)) == chunksOf(xs.concat(ys)), n)
 * ```
 *
 * whenever `n` evenly divides the length of `xs`.
 *
 * @example
 * import { chunksOf } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(chunksOf([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]])
 *
 * @function
 * @since 1.10.0
 */
exports.chunksOf = function (as, n) {
    return exports.isOutOfBound(n - 1, as) ? [as] : exports.chop(as, function (as) { return exports.split(n, as); });
};
function comprehension(input, f, g) {
    var go = function (scope, input) {
        if (input.length === 0) {
            return f.apply(void 0, scope) ? [g.apply(void 0, scope)] : exports.empty;
        }
        else {
            return chain(input[0], function (x) { return go(exports.snoc(scope, x), input.slice(1)); });
        }
    };
    return go(exports.empty, input);
}
exports.comprehension = comprehension;
/**
 * Creates an array of unique values, in order, from all given arrays using a {@link Setoid} for equality comparisons
 *
 * @example
 * import { union } from 'fp-ts/lib/Array'
 * import { setoidNumber } from 'fp-ts/lib/Setoid'
 *
 * assert.deepEqual(union(setoidNumber)([1, 2], [2, 3]), [1, 2, 3])
 *
 * @function
 * @since 1.12.0
 */
exports.union = function (S) {
    var memberS = exports.member(S);
    return function (xs, ys) { return function_1.concat(xs, ys.filter(function (a) { return !memberS(xs, a); })); };
};
/**
 * Creates an array of unique values that are included in all given arrays using a {@link Setoid} for equality
 * comparisons. The order and references of result values are determined by the first array.
 *
 * @example
 * import { intersection } from 'fp-ts/lib/Array'
 * import { setoidNumber } from 'fp-ts/lib/Setoid'
 *
 * assert.deepEqual(intersection(setoidNumber)([1, 2], [2, 3]), [2])
 *
 * @function
 * @since 1.12.0
 */
exports.intersection = function (S) {
    var memberS = exports.member(S);
    return function (xs, ys) { return xs.filter(function (a) { return memberS(ys, a); }); };
};
/**
 * Creates an array of array values not included in the other given array using a {@link Setoid} for equality
 * comparisons. The order and references of result values are determined by the first array.
 *
 * @example
 * import { difference } from 'fp-ts/lib/Array'
 * import { setoidNumber } from 'fp-ts/lib/Setoid'
 *
 * assert.deepEqual(difference(setoidNumber)([1, 2], [2, 3]), [1])
 *
 * @function
 * @since 1.12.0
 */
exports.difference = function (S) {
    var memberS = exports.member(S);
    return function (xs, ys) { return xs.filter(function (a) { return !memberS(ys, a); }); };
};
var traverseWithIndex = function (F) { return function (ta, f) {
    return reduceWithIndex(ta, F.of(zero()), function (i, fbs, a) {
        return F.ap(F.map(fbs, function (bs) { return function (b) { return exports.snoc(bs, b); }; }), f(i, a));
    });
}; };
var partitionMapWithIndex = function (fa, f) {
    var left = [];
    var right = [];
    for (var i = 0; i < fa.length; i++) {
        var e = f(i, fa[i]);
        if (e.isLeft()) {
            left.push(e.value);
        }
        else {
            right.push(e.value);
        }
    }
    return {
        left: left,
        right: right
    };
};
var partitionWithIndex = function (fa, p) {
    var left = [];
    var right = [];
    for (var i = 0; i < fa.length; i++) {
        var a = fa[i];
        if (p(i, a)) {
            right.push(a);
        }
        else {
            left.push(a);
        }
    }
    return {
        left: left,
        right: right
    };
};
var filterMapWithIndex = function (fa, f) {
    var result = [];
    for (var i = 0; i < fa.length; i++) {
        var optionB = f(i, fa[i]);
        if (optionB.isSome()) {
            result.push(optionB.value);
        }
    }
    return result;
};
var filterWithIndex = function (fa, p) {
    return fa.filter(function (a, i) { return p(i, a); });
};
/**
 * @instance
 * @since 1.0.0
 */
exports.array = {
    URI: exports.URI,
    map: map,
    mapWithIndex: mapWithIndex,
    compact: compact,
    separate: separate,
    filter: filter,
    filterMap: filterMap,
    partition: partition,
    partitionMap: exports.partitionMap,
    of: of,
    ap: ap,
    chain: chain,
    reduce: reduce,
    foldMap: foldMap,
    foldr: reduceRight,
    unfoldr: unfoldr,
    traverse: traverse,
    sequence: sequence,
    zero: zero,
    alt: alt,
    extend: extend,
    wither: wither,
    wilt: wilt,
    reduceWithIndex: reduceWithIndex,
    foldMapWithIndex: foldMapWithIndex,
    foldrWithIndex: foldrWithIndex,
    traverseWithIndex: traverseWithIndex,
    partitionMapWithIndex: partitionMapWithIndex,
    partitionWithIndex: partitionWithIndex,
    filterMapWithIndex: filterMapWithIndex,
    filterWithIndex: filterWithIndex
};
