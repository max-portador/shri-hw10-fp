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
    tap, length, test, ifElse, andThen, lensProp,
    append, apply, prop, converge, multiply, identity, modulo, concat, tryCatch, thunkify, otherwise
} from "ramda"

import Api from '../tools/api';

const api = new Api();
const baseURL = 'https://api.tech/numbers/base'
const animalURL = 'https://animals.tech/'


const getResult = prop("result")
const formAnimalUrl = concat(animalURL)
const askServerForAnimal = api.get(__, null)


const moduloDivBy3 = modulo(__, 3)
const square = converge( multiply, [identity, identity])

const queryParams =  {from: 10,
                        to: 2,
                    number: null}
const prepareQueryParams = set(lensProp("number"), __, queryParams)
const formValidBaseUrl = append(__, [baseURL])
const askServerForBase = apply(api.get)

const roundValue = compose(
    Math.round,
    Number
)

const validateLength =  compose(
    both( gt(__, 2), lt(__, 10)),
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

const log = tap(writeLog)
const onError = thunkify(handleError)
const resultFromServer = pipe(
    andThen(getResult),
    otherwise(handleError)
)

const prepareNumber = pipe(
    String,
    length,
    log,
    square,
    log,
    moduloDivBy3,
)

const convertToBinary = pipe(
    String,
    prepareQueryParams,
    formValidBaseUrl,
    askServerForBase,
    andThen(getResult),
    resultFromServer
)

const getAnimal = pipe(
    String,
    log,
    formAnimalUrl,
    askServerForAnimal,
    resultFromServer
)

const step1 = pipe(
    roundValue,
    log,
    convertToBinary,
)

const step2 = pipe(
    log,
    prepareNumber,
    log,
    getAnimal,
    andThen(handleSuccess),
    otherwise(handleError)
)

 const onTrue = pipe(
     step1,
     andThen(step2),
     otherwise(handleError)
 )

const mainProcessor = await pipe(
                    log,
                    ifElse(
                        validate,
                        onTrue,
                        onError(VALIDATION_FAILURE_MESSAGE)
                    )
        )

tryCatch(mainProcessor, onError)(value)

}

export default processSequence;
