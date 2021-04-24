const cakes = [{ weight:7, pounds: 160 }, { weight: 3, pounds: 90 }, { weight: 2, pounds: 15}]
const capacity = 20

const maxDuffelBagValue = (cakes, capacity) => {
    let duffleBag = {
        weight: 0,
        value: 0
    }
    const addCakeToBag = (cake) => {
        duffleBag.weight += cake.weight
        duffleBag.value += cake.pounds
    }
    const sortCakesByRatio = cakes.map(cake => {return {...cake, ratio: cake.pounds / cake.weight}}).sort((a, b) => {
        if (a.ratio < b.ratio){
            return 1
        } if (a.ratio > b.ratio){
            return -1
        }
        return 0
    })
    while(sortCakesByRatio.length > 0){
        const cakeToTest = sortCakesByRatio[0]
        while (cakeToTest.weight + duffleBag.weight <= capacity){
            addCakeToBag(cakeToTest)
        }
        sortCakesByRatio.shift()
    }
    console.log("The bag is full, time to make a getaway!")
    console.log(duffleBag)
    return duffleBag.value
}
//Returns 555 (6 of the middle type of cake and 1 of the last type of cake)
console.log(maxDuffelBagValue(cakes, capacity))