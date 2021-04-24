const cakes = [{ weight:7, pounds: 160 }, { weight: 3, pounds: 90 }, { weight: 2, pounds: 15}]
const capacity = 20

//what if cake exists with same weight but higher ratio
//what if cake exists with weight of 0


const maxDuffelBagValue = (cakes, capacity) => {
    let duffleBag = {
        weight: 0,
        value: 0
    }
    const addCakeToBag = (cake) => {
        duffleBag.weight += cake.weight
        duffleBag.value += cake.pounds
    }

    let ratios = []
    let weights = []
    let highestRatio = 0
    let lowestWeight = 0
    let highestWeight = 0

    while(capacity >= duffleBag.weight ){
        cakes.forEach(cake => {
            cake.ratio = cake.pounds / cake.weight;
            ratios.push(cake.ratio)
            weights.push(cake.weight)
            if(cake.ratio > highestRatio){
                highestRatio = cake.ratio
            }
            if(cake.weight > highestWeight){
                highestWeight = cake.weight
                lowestWeight = cake.weight
            }
            if (cake.weight < lowestWeight){
                lowestWeight = cake.weight
            }
        })
        let cakeToAdd = cakes.find(cake => cake.ratio === highestRatio)
        if( cakeToAdd.weight + duffleBag.weight <= capacity){
            addCakeToBag(cakeToAdd)
        }else{
            cakeToAdd = cakes.find(cake => cake.weight === lowestWeight)
            if(cakeToAdd.weight + duffleBag.weight <= capacity){      
                addCakeToBag(cakeToAdd)
            }else{
                console.log("The bag is full, time to make a getaway!")
                console.log(duffleBag)
                return duffleBag.value
            }
        }
    }
}
//Returns 555 (6 of the middle type of cake and 1 of the last type of cake)
maxDuffelBagValue(cakes, capacity)