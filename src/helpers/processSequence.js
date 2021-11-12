/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */

import {
    __, allPass, both, compose, set, gt, lt, pipe,
    tap, length, test, ifElse, pipeWith, andThen, lensProp,
    append, apply, prop, converge, multiply, identity, modulo, concat, tryCatch, startsWith, head, anyPass
} from "ramda"

import Api from '../tools/api';

const api = new Api();
const baseURL = 'https://api.tech/numbers/base'
const animalURL = 'https://animals.tech/'
const getResult = prop("result")
const resolve = (value) => Promise.resolve(value)

const getAnimal = pipeWith(andThen, [
    resolve,
    String,
    concat(animalURL),
    api.get(__, null),
    getResult
])

const square = converge(
    multiply,
    [identity, identity]
)

const queryParams =  {from: 10,
                        to: 2,
                    number: null}

const convertToBinary = pipeWith(andThen, [
    resolve,
    set(
        lensProp("number"),
        __,
       queryParams
    ),
    append(__, [baseURL]),
    apply(api.get),
    getResult
])

const roundValue = compose(
    Math.round,
    Number
)

const isNotInfinity = compose(
    Number.isFinite,
    Number
)

const validateLength =  compose(
    both(
        gt(__, 2),
        lt(__, 10)
    ),
    length,
    String
)

const isPositive =  compose(
    gt(__, 0),
    Number
)

const isOnlyDigitsAndPoint = anyPass([
    startsWith('0.'),
    compose(
        test(/[1-9]/),
        head,
    ),
])

const validate = allPass([
        isNotInfinity,
        validateLength,
        isPositive,
        isOnlyDigitsAndPoint
    ])

const VALIDATION_FAILURE_MESSAGE = "ValidationError"


const processSequence = async ({
       value, writeLog, handleSuccess, handleError
}) => {
const prepareNumber = pipe(
    String,
    length,
    tap(writeLog),
    square,
    tap(writeLog),
    modulo(__, 3),
    tap(writeLog),
)

 const onTrue =   pipeWith( andThen, [
     resolve,
     roundValue,
     tap(writeLog),
     convertToBinary,
     tap(writeLog),
     prepareNumber,
     getAnimal,
     handleSuccess
 ])

const onFalse = () => { handleError(VALIDATION_FAILURE_MESSAGE) }

const tryer =  await pipe(
                    tap(writeLog),
                    ifElse(
                        validate,
                        onTrue,
                        onFalse
                    )
        )

tryCatch(tryer, handleError)(value)

    // writeLog(value);
    //
    // api.get('https://api.tech/numbers/base', {from: 2, to: 10, number: '01011010101'}).then(({result}) => {
    //     writeLog(result);
    // });
    //
    // wait(2500).then(() => {
    //     writeLog('SecondLog')
    //
    //     return wait(1500);
    // }).then(() => {
    //     writeLog('ThirdLog');
    //
    //     return wait(400);
    // }).then(() => {
    //     handleSuccess('Done');
    // });
}

export default processSequence;
