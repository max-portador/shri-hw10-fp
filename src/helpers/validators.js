import {
    __,
    allPass,
    anyPass,
    equals,
    gte,
    compose,
    converge,
    curry,
    keys,
    not,
    or,
    length,
    filter,
    values,
    all,
    apply,
    propSatisfies,
    props
} from "ramda";

const isWhite = equals("white")
const isGreen = equals("green")
const isRed = equals("red")
const isBlue = equals("blue")
const isOrange = equals("orange")

const shapesColored = (color) => filter(equals(color, __))

const getNumberColoredShapes = (color) => compose(
    length,
    keys,
    shapesColored(color)
)

const numberColoredShapesGTE = (color, number) =>  compose(
    gte(__, number),
    getNumberColoredShapes(color)
)

const numberColoredShapesEq = (color, number) => compose(
    equals(__, number),
    getNumberColoredShapes(color)
)

const curriedNumberColoredShapesGTE = curry(numberColoredShapesGTE)
const hasTwoGreenShapes = numberColoredShapesEq("green", 2)
const hasOneRedShape = numberColoredShapesEq("red",1)
const numberColoredShapesGTE3 = curriedNumberColoredShapesGTE(__, 3)
const hasGreenTriangle = propSatisfies(isGreen, "triangle")

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
    propSatisfies(isGreen, "square"),
    propSatisfies(isRed, "star"),
    compose(
        all(isWhite),
        props(["triangle", "circle"])
    )
])

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = shapes => numberColoredShapesGTE("green", 2)(shapes)

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = shapes => {
    const amountBlueShapes = getNumberColoredShapes("blue")
    const amountRedShapes = getNumberColoredShapes("red")
    const isRedBlueEq = converge(equals, [amountBlueShapes, amountRedShapes])
    return isRedBlueEq(shapes)
}

// 4. Синий круг, красная звезда, оранжевый квадрат
export const validateFieldN4 = allPass([
    propSatisfies(isBlue, "circle"),
    propSatisfies(isRed, "star"),
    propSatisfies(isOrange, "square")
])

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 =  anyPass([
        numberColoredShapesGTE3("red"),
        numberColoredShapesGTE3("green"),
        numberColoredShapesGTE3("blue"),
        numberColoredShapesGTE3("orange"),
    ])

// 6. Две зеленые фигуры (одна из них треугольник), еще одна любая красная.
export const validateFieldN6 = allPass([
        hasGreenTriangle,
        hasTwoGreenShapes,
        hasOneRedShape,
    ])

// 7. Все фигуры оранжевые.
export const validateFieldN7 = compose(
    all(isOrange),
    values
)

// 8. Не красная и не белая звезда.
export const validateFieldN8 = ({star}) => {
    const shapeColoredBy = converge(or,[isRed, isWhite])
    const shapeNotColoredBy = compose(
        not,
        shapeColoredBy
    )
    return shapeNotColoredBy(star)

}

// 9. Все фигуры зеленые.
export const validateFieldN9 =  compose(
    all(isGreen),
    values
)


// 10. Треугольник и квадрат одного цвета (не белого)
export const validateFieldN10 = ({triangle, square}) => {
    const isNotWhite = compose(
        not,
        apply(isWhite),
        values
    )
    const hasSameColor = compose(
        apply(equals),
        values)

    const is10thFieldValid = allPass([
        isNotWhite,
        hasSameColor
    ])

    return is10thFieldValid({triangle, square})
}