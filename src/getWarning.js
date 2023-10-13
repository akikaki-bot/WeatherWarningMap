
const GetDatas = [
    "20231013023646_0_VPWW53_350000",
    "20231013030347_0_VPWW53_120000",
    "20231013023052_0_VPWW53_390000",
    "20231013014013_0_VPWW53_450000",
    "20231013012715_0_VPWW53_440000",
    "20231013011746_0_VPWW53_130000",
    "20231013011614_0_VPWW53_420000",
    "20231013011552_0_VPWW53_140000",
    "20231013011314_0_VPWW53_150000",
    "20231013010920_0_VPWW53_400000",
]

async function GetExtra ( ){
    const response = await fetch(`https://jxp.aknet.tech/v1/extra`, {
        mode : "cors"
    })

    const data = await response.json()
    return data.data
}

async function DisplayExtraCodes(){
    const ExtraDatas = await GetExtra()
    const VPWW53_Array = ExtraDatas.filter( data => data.code === "VPWW53" )

    const Codes = VPWW53_Array.map( data =>  {
       const s = data.mainLink.link.split("/")[6].replace('.xml',"") 
       const dateRaw = String(s.split('_')[0])
       const year = +dateRaw.substring(0, 4)
       const month = +dateRaw.substring(4,6)
       const day = +dateRaw.substring(6,8)

       const NowDate = new Date()
       NowDate.setTime(NowDate.getTime())

       if(
            year === NowDate.getFullYear() &&
            month === NowDate.getMonth() + 1 &&
            day === NowDate.getDate()
       ) {
           return s
       }
    }).filter(v => typeof v !== "undefined")
    
    return Codes
}

async function GetWarning ( id ) {
    const response = await fetch(`https://jxp.aknet.tech/v1/vpww53/parse?id=${id}`, {
        mode : "cors"
    })

    const data = await response.json()
    return data.data.InfomationDetail.Citys
}

async function DisplayWarning (){
    const TodayWarnings = await DisplayExtraCodes()
    TodayWarnings.map(async ids => {
        const Areas = await GetWarning( ids )
    
        if(STATE === 1) {
                Areas.map(p => {
                    Object.values(JapanCitysLeafletData._layers).map(data => {
                        if(Number(data.feature.properties.regioncode) === p.Area.code) {
                            console.log(WarningChange(p.Kinds.map(v => v.Name)))
                            data.setStyle({ fillColor : WarningChange(p.Kinds.map(v => v.Name)) })
                        }
                    })
                })
        }
    })
}

function WarningChange ( state ) {
    if(typeof state[0] === "undefined")  return "#081a1a"
    switch( true ) {
        case (/解除/).test(state[0]) : return "#20B0FF"
        case (/なし/).test(state[0]) : return "#081a1a"
        case (/注意報/).test(state[0]) : return "#EFEF20"
        case (/警報/).test(state[0]) : return "#FF2020"
        case (/特別警報/).test(state[0]) : return "#FF00FF"
    }
}