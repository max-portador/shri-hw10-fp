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
    append, apply, prop, converge, multiply, identity, modulo, concat, tryCatch
} from "ramda"

import Api from '../tools/api';

const api = new Api();
const baseURL = 'https://api.tech/numbers/base'
const animalURL = 'https://animals.tech/'
const getResult = prop("result")
const resolve = (value) => Promise.resolve(value)

const formAnimalUrl = concat(animalURL)
const askServerForAnimal = api.get(__, null)

const getAnimal = pipeWith(andThen, [
    resolve,
    String,
    formAnimalUrl,
    askServerForAnimal,
    getResult
])

const square = converge(
    multiply,
    [identity, identity]
)

const queryParams =  {from: 10,
                        to: 2,
                    number: null}

const prepareQueryParams = set(lensProp("number"), __, queryParams)
const formValidBaseUrl = append(__, [baseURL])
const askServerForBase = apply(api.get)

const convertToBinary = pipeWith(andThen, [
    resolve,
    String,
    prepareQueryParams,
    formValidBaseUrl,
    askServerForBase,
    getResult
])

const roundValue = compose(
    Math.round,
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

const isNumber = test(new RegExp('^\\d+(.\\d+)?$'))

const validate = allPass([
        validateLength,
        isPositive,
        isNumber
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

)

 const onTrue = pipeWith( andThen, [
     resolve,
     roundValue,
     tap(writeLog),
     convertToBinary,
     tap(writeLog),
     prepareNumber,
     tap(writeLog),
     getAnimal,
     handleSuccess
 ])

const onFalse = () => { handleError(VALIDATION_FAILURE_MESSAGE) }

const mainProcessor =  await pipe(
                    tap(writeLog),
                    ifElse(
                        validate,
                        onTrue,
                        onFalse
                    )
        )

tryCatch(mainProcessor, handleError)(value)

}

export default processSequence;
