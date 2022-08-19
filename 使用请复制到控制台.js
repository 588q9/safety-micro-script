//用户填写参数
let token=''
let userProjectId=''
let tenantCode=''
let userId=''


function ajaxRequest(url,sendData,method,resolve){
  
    
    $.ajax({
      
        url: url+'?timestamp='+new Date().getTime(),
        type: method,
        dataType: "json",
        data: sendData,
        timeout: 5000,
    headers:{
        'X-Token':
        token
    }
        ,
        success : function (data) {


            resolve(data)


        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        }
    });
    


}


let studyUrl='https://weiban.mycourse.cn/pharos/usercourse/study.do'



let finishData = {"userCourseId": '', "tenantCode": tenantCode

}

let listCourseUrl='https://weiban.mycourse.cn/pharos/usercourse/listCourse.do'
let listCategoryUrl='https://weiban.mycourse.cn/pharos/usercourse/listCategory.do'
let finishCourseUrl='https://weiban.mycourse.cn/pharos/usercourse/finish.do'
let getCOurse={
    'courseId':'',
    'userProjectId':userProjectId,
    'tenantCode':tenantCode,
    "userId": userId
}

var listCategory = {
    'userProjectId':userProjectId
    ,'chooseType':"3"
,'userId'	:userId,
    'tenantCode':tenantCode
};
var listCourse = {
    "userProjectId": userProjectId,
    "chooseType": 3,
    
    "categoryCode": 0,
    "name": "",
    "userId": userId,
    "tenantCode": tenantCode
};
let request=new Promise(
    (resolve, reject)=>{
        ajaxRequest(
            listCategoryUrl,
        listCategory,'POST',resolve)
    }
    )
request.then((data)=>{
    let res=data['data']
    let aggregateList=[]
    let index=0
   for(item  of res){
//     if(index++<=5){
// continue
//     }
aggregateList.push(item['categoryCode'])   

}
return aggregateList
}).then((data)=>{
    let requestList=[]
    for(item of data){
        listCourse['categoryCode']=item
        requestList.push(
            new Promise((resolve,reject)=>{
                ajaxRequest(listCourseUrl,listCourse,'POST',resolve)
            })

        )
            
    }
   return Promise.all(requestList)
}).then((data)=>{
    let res=[]

for(item of data){
 for(nestItem of item['data']){
    res.push({
        'userCourseId':nestItem['userCourseId'],
        'courseId':nestItem['resourceId'],
        resourceName:nestItem['resourceName']
    }
    )
    
     
 }

}



return res
}).then((data)=>{
console.log(data)
console.log('开始')   
let executeChain=Promise.resolve('start')
   
    
data.forEach((item)=>{
    
    
   let courseId=item['userCourseId']
executeChain=executeChain.then(()=>{

    return new Promise((resolve,reject)=>{
        Promise.resolve().then(()=>{
            return new Promise((resolve, reject) => {
                setTimeout(()=>{
                    resolve()
                },10000)
            })
        }).
        
        then(
            ()=>{

               return  new Promise((resolve, reject) => {
                getCOurse['courseId']=item['courseId']

                    ajaxRequest(
                        studyUrl,
                        getCOurse,'POST',
                    resolve
                    )    
                })
                
            }
        )

        .then(()=>{
            setTimeout(

                ()=>{
                    
                        $.ajax({
                           
                            url: finishCourseUrl,
                            type: "GET",
                            headers:{
                                'X-Token':token
                            },
                            data: {"userCourseId": courseId, "tenantCode": tenantCode,'_':new Date().getTime(),},
                            timeout: 5000,
                        
                            success :  (data)=> {
                                console.log(data)
                                console.log(item)
                               resolve()
                                
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                reject()
            
                            }
                        });
    
                    
    
              
    
    
                },(60+((Math.random()*20)+5))*1000
              )
        })

        
    })


    
})



})


   
}).then((res)=>{
console.log(res)
})
