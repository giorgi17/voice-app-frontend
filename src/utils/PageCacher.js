class PageCasher {

    // Check if cache for specific page is stored in localstorage and creates one with empty object 
    // if it's not. If if it created, get's values from properties of page specific object and these 
    // property names are provided as an argument as an array which are states of component that 
    // are asynchronous
    static cachePageOnMount = componentName => {
        // Checking if main data object even exists in localstorage
        let mainPageCacheObject = localStorage.getItem('mainPageCacheObject');
        if (mainPageCacheObject) {
            mainPageCacheObject = JSON.parse(mainPageCacheObject);
        } else {
            localStorage.setItem('mainPageCacheObject', JSON.stringify({}));
            return false;
        }

        // Checking if this page's specific data object even exists in localstorage
        const fullThisRoute = window.location.href.split("/");
        fullThisRoute.splice(0,3);
        const thisRoute = fullThisRoute.join('/');
        if (!mainPageCacheObject.hasOwnProperty(thisRoute)) {
            mainPageCacheObject[thisRoute] = {};
            mainPageCacheObject[thisRoute]['data'] = {};
            mainPageCacheObject[thisRoute]['scroll'] = {};
            mainPageCacheObject[thisRoute]['scroll'].scrollX = window.scrollX;
            mainPageCacheObject[thisRoute]['scroll'].scrollY = window.scrollY;
        }

        if (mainPageCacheObject[thisRoute].data.hasOwnProperty(componentName)) {
            return {scroll: mainPageCacheObject[thisRoute].scroll,
                data: mainPageCacheObject[thisRoute].data[componentName]};
        } else {
            mainPageCacheObject[thisRoute].data[componentName] = {};
            localStorage.setItem('mainPageCacheObject', JSON.stringify(mainPageCacheObject));
            return false;
        }
    }
    
    // Updates page specific object stored in localstorage on every asynchronous call
    static cachePageUpdate = (parentObjectName=null, dataArray, componentName, parentObjectIsArray=null,
            route=null) => {
        // Checking if main data object even exists in localstorage
        let mainPageCacheObject = localStorage.getItem('mainPageCacheObject');
        if (mainPageCacheObject)
            mainPageCacheObject = JSON.parse(mainPageCacheObject);
        else
            return;

        // Checking if this page's specific data object even exists in localstorage
        let thisRoute = '';
        if (route) {
            thisRoute = route;
        } else {
            const fullThisRoute = window.location.href.split("/");
            fullThisRoute.splice(0,3);
            thisRoute = fullThisRoute.join('/');
        }
        
        let routeNoNExistent = false;
        if (!mainPageCacheObject.hasOwnProperty(thisRoute)) {
            routeNoNExistent = true;
            mainPageCacheObject[thisRoute] = {};
            mainPageCacheObject[thisRoute]['data'] = {};
            mainPageCacheObject[thisRoute]['scroll'] = {};
            mainPageCacheObject[thisRoute]['scroll'].scrollX = window.scrollX;
            mainPageCacheObject[thisRoute]['scroll'].scrollY = window.scrollY;
        }

        if (mainPageCacheObject[thisRoute].data.hasOwnProperty(componentName)) {
            if (parentObjectName) {
                if (!mainPageCacheObject[thisRoute]['data'][componentName].hasOwnProperty(parentObjectName)) {
                    if (!parentObjectIsArray)
                        mainPageCacheObject[thisRoute]['data'][componentName][parentObjectName] = {};
                    else
                        mainPageCacheObject[thisRoute]['data'][componentName][parentObjectName] = [];
                }
            }

            dataArray.forEach((element, index) => {
                if (parentObjectName) {
                    if (!parentObjectIsArray) {
                        mainPageCacheObject[thisRoute]['data'][componentName][parentObjectName][element.name] = element.data;
                    } else {
                        if (routeNoNExistent)
                            return;
                        mainPageCacheObject[thisRoute]['data'][componentName][parentObjectName][element.index][element.name] = element.data;
                    }
                } else {
                    mainPageCacheObject[thisRoute]['data'][componentName][element.name] = element.data;
                }
            });
        } else {
            mainPageCacheObject[thisRoute].data[componentName] = {};
            mainPageCacheObject[thisRoute]['data'][componentName][parentObjectName] = {};
            dataArray.forEach(element => {
                if (parentObjectName)
                    mainPageCacheObject[thisRoute]['data'][componentName][parentObjectName][element.name] = element.data;
                else
                    mainPageCacheObject[thisRoute]['data'][componentName][element.name] = element.data;
            });
        }

        localStorage.setItem('mainPageCacheObject', JSON.stringify(mainPageCacheObject));
    }

    // Add to array component property
    static cachePageArrayObjectUpdate = (parentObjectName=null, dataArray, componentName, route=null) => {
        // Checking if main data object even exists in localstorage
        let mainPageCacheObject = localStorage.getItem('mainPageCacheObject');
        if (mainPageCacheObject)
            mainPageCacheObject = JSON.parse(mainPageCacheObject);
        else
            return;

        // Checking if this page's specific data object even exists in localstorage
        let thisRoute = '';
        if (route) {
            thisRoute = route;
        } else {
            const fullThisRoute = window.location.href.split("/");
            fullThisRoute.splice(0,3);
            thisRoute = fullThisRoute.join('/');
        }
        
        let routeNoNExistent = false;
        if (!mainPageCacheObject.hasOwnProperty(thisRoute)) {
            routeNoNExistent = true;
            mainPageCacheObject[thisRoute] = {};
            mainPageCacheObject[thisRoute]['data'] = {};
            mainPageCacheObject[thisRoute]['scroll'] = {};
            mainPageCacheObject[thisRoute]['scroll'].scrollX = window.scrollX;
            mainPageCacheObject[thisRoute]['scroll'].scrollY = window.scrollY;
        }

        if (mainPageCacheObject[thisRoute].data.hasOwnProperty(componentName)) {
            if (parentObjectName) {
                if (!mainPageCacheObject[thisRoute]['data'][componentName].hasOwnProperty(parentObjectName)) 
                    mainPageCacheObject[thisRoute]['data'][componentName][parentObjectName] = [];            
            }
            
            dataArray.forEach((element, index) => {
                if (parentObjectName) {
                    mainPageCacheObject[thisRoute]['data'][componentName][parentObjectName].unshift(element);
                } else {
                    mainPageCacheObject[thisRoute]['data'][componentName].unshift(element);
                }
            });
        } else {
            if (parentObjectName) {
                mainPageCacheObject[thisRoute].data[componentName] = {};
                mainPageCacheObject[thisRoute]['data'][componentName][parentObjectName] = [];
            } else {
                mainPageCacheObject[thisRoute].data[componentName] = [];
            }
  
            dataArray.forEach(element => {
                if (parentObjectName)
                    mainPageCacheObject[thisRoute]['data'][componentName][parentObjectName].unshift(element);
                else
                    mainPageCacheObject[thisRoute]['data'][componentName].unshift(element);
            });
        }

        localStorage.setItem('mainPageCacheObject', JSON.stringify(mainPageCacheObject));
    }

    static cachePageSaveScroll = thisRoute => {
         // Checking if main data object even exists in localstorage
         let mainPageCacheObject = localStorage.getItem('mainPageCacheObject');
         if (mainPageCacheObject)
             mainPageCacheObject = JSON.parse(mainPageCacheObject);
         else
             return;
        
        // Checking if this page's specific data object even exists in localstorage
        if (mainPageCacheObject.hasOwnProperty(thisRoute)) {
            mainPageCacheObject[thisRoute]['scroll'].scrollX = window.scrollX;
            mainPageCacheObject[thisRoute]['scroll'].scrollY = window.scrollY;
            localStorage.setItem('mainPageCacheObject', JSON.stringify(mainPageCacheObject));
            return mainPageCacheObject[thisRoute]['scroll'].scrollY;
        } else {
            return false;
        }
    }

    static areAllPropertiesCached = (componentPropertyArray = null, cachedPropertyObject = null) => {
        let cachedPropertyArray;
        if (cachedPropertyObject) 
            cachedPropertyArray = Object.keys(cachedPropertyObject);
        else
            return false;

        if (!Array.isArray(componentPropertyArray) || ! Array.isArray(cachedPropertyArray))
            return false;

        cachedPropertyArray.sort();
        componentPropertyArray.sort();   
     
        let contains = true;
        for (let i = 0; i < componentPropertyArray.length; i++) {   
            // if (componentPropertyArray[i] !== cachedPropertyArray[i]) {
            //     contains = false;
            //     break;
            // }
            if (cachedPropertyArray.indexOf(componentPropertyArray[i]) === -1) {
                contains = false;
                break;
            }
        };

        return contains;
    }

}

export default PageCasher;