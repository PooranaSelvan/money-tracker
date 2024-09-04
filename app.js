const StrgeCtrl = ( () => {
    return {
  
      getItems:() => {
  
          let items; 
  
          // Check if any item in LS
          if(localStorage.getItem("items") === null){
              items = [];
          }else{
              // Get the Existing data from ls
              items = JSON.parse(localStorage.getItem("items"));
          }
  
          return items;
  
      },
      storeItem:(item) => {
         
        let items; 

        // Check if any item in LS
        if(localStorage.getItem("items") === null){
            
            items = [];

            // Push New Item
            items.push(item);

            // Set LS
            localStorage.setItem("items", JSON.stringify(items));

        } else {

            // Get the Existing data from ls
            items = JSON.parse(localStorage.getItem("items"));

            // Push the new item
            items.push(item);

             // resett LS
             localStorage.setItem("items", JSON.stringify(items));
            
        }
    },
    deleteItemLs:(id) => {
        
        let items = JSON.parse(localStorage.getItem("items"));

        items.forEach(function(item, index){
            if(id === item.id){
                items.splice(index, 1);
            }
        });

        localStorage.setItem("items", JSON.stringify(items));

    },
    updateItemLs:(updatedItem) => {
      
        let items = JSON.parse(localStorage.getItem("items"));

        items.forEach(function(item, index){
            if(updatedItem.id === item.id){
                items.splice(index, 1, updatedItem);
            }
        });

        localStorage.setItem("items", JSON.stringify(items));
    },
    clearAllItems: () => {
        localStorage.clear("items");
    }
    }
})();


const uiCtrl = ( () => {

    return{
        defaultBtns:() => {
            document.querySelector(".add-btn").style.display = "inline";
            document.querySelector(".update-btn").style.display = "none";
            document.querySelector(".delete-btn").style.display = "none";
            document.querySelector(".back-btn").style.display = "none";
        },
        editBtns:() => {
            document.querySelector(".add-btn").style.display = "none";
            document.querySelector(".update-btn").style.display = "inline";
            document.querySelector(".delete-btn").style.display = "inline";
            document.querySelector(".back-btn").style.display = "inline";
        },
        displayItems:(item) => {
            const ul = document.getElementById("item-list");
            const li = document.createElement('li');
            li.className = "collection-item";
            li.id = `item-${item.id}`
            li.innerHTML = `
                <strong>${item.name} : <em>${item.money}</em></strong>
                <a href="#" class="secondary-content">
                    <i class="fa-solid fa-pencil edit-item"></i>
                </a>
            `
            ul.appendChild(li);

            // To Empty Input Fields
        },
        emptyInputFields:() => {
            document.querySelector("#item-name").value = "";
            document.querySelector("#item-money").value = "";
        },
        getInput:() => {
            return{
                name:document.querySelector("#item-name").value,
                money:document.querySelector("#item-money").value
            }
        },
        displayTotal: (total) => {
            document.getElementById('total-money').textContent = total;
        },
        showItemUi: () => {
            const currentItem = itemCtrl.getItem(); // Fetch the current item
            document.querySelector("#item-name").value = currentItem.name;
            document.querySelector("#item-money").value = currentItem.money;
        },
        deleteUiItem:(id) => {
            const itemId = `#item-${id}`;
            const item = document.querySelector(itemId);
            item.remove();
        },
        updatedItemUI:(item) => {
            let listItems = document.querySelectorAll(".collection-item");

            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute("id");

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `
                        <strong>${item.name} : <em>${item.money}</em></strong>
                        <a href="#" class="secondary-content">
                            <i class="fa-solid fa-pencil edit-item"></i>
                        </a>
                    `
                }
            });
        }
    }
})();

const itemCtrl = ( () => {
    class Item{
        constructor(id, name, money){
            this.id = id;
            this.name = name;
            this.money = parseFloat(money);
        }
    }

    const data = {
        items: StrgeCtrl.getItems(),
        totalMoney: 0,
        currentItem: null
    }

    return {
        storedItems:() => {
            return data.items;
        },
        showInput: (name, money) => {
            let id = 0;

            if(data.items.length > 0){
                id = data.items[data.items.length - 1].id + 1;
            } else {
                id = 0;
            }

            let newItem = new Item(id, name, money);

            // Add to Item Array
            data.items.push(newItem);

            return newItem;
        },
        totalMoney: () => {
            let total = 0;
            if(data.items.length > 0){
                data.items.forEach((ele) => {
                    total += ele.money;
                    data.totalMoney = total;
                });
            } else {
                return data.totalMoney = 0;
            }

            return total;
        },
        clearData: () => {
            data.items = [];
        },
        searchElement: (id) => {
            let found = null;
            data.items.forEach(ele => {
                if(id === ele.id){
                    found = ele;
                }
            });
            return found;
        },
        setItem: (ele) => {
            data.currentItem = ele;
        },
        getItem: () => {
            return data.currentItem;
        },
        deleteItem: (id) => {
            const ids = data.items.map((ele) => {
                return ele.id;
            });

            const index = ids.indexOf(id);

            data.items.splice(index, 1);
        },
        updateItem:(name, money) => {
            let found = null;

            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.money = parseFloat(money);
                    found = item;
                }
            });

            return found;
        }
    }
})();

const appCtrl = ( () => {
    // Edit Button
    document.getElementById("item-list").addEventListener("click", (e) => {
        e.preventDefault();
        if(e.target.className === "fa-solid fa-pencil edit-item"){
            uiCtrl.editBtns();
            const list = e.target.parentElement.parentElement.id;
            // Break into an array
            const listArr = list.split("-");
            // Get the actual Array
            const id = parseInt(listArr[1]);

            const searchElement = itemCtrl.searchElement(id);
            itemCtrl.setItem(searchElement);
            uiCtrl.showItemUi();
        }
    });

    // Add Task
    document.querySelector(".add-btn").addEventListener("click", (e) => {
        e.preventDefault();
        const input = uiCtrl.getInput();

        if(input.name === "" || input.money === ""){
            alert("Please Fill Every Feilds..");
        } else {
            const showInputUi = itemCtrl.showInput(input.name, input.money);
            uiCtrl.displayItems(showInputUi);

            const total = itemCtrl.totalMoney();
            uiCtrl.displayTotal(total);
            uiCtrl.emptyInputFields();

            // Store to ls
            StrgeCtrl.storeItem(showInputUi);
        }
    });

    // Update Button
    document.querySelector(".update-btn").addEventListener("click", (e) => {
        e.preventDefault();
        const input = uiCtrl.getInput();

        // Update Item
        const updateItem = itemCtrl.updateItem(input.name, input.money);

        // Update UI
        uiCtrl.updatedItemUI(updateItem);

        // Total Money
        const total = itemCtrl.totalMoney();
        uiCtrl.displayTotal(total);

        uiCtrl.defaultBtns();
        uiCtrl.emptyInputFields();

        StrgeCtrl.updateItemLs(updateItem);
    });

    // Back Button
    document.querySelector(".back-btn").addEventListener("click", (e) => {
        e.preventDefault();
        uiCtrl.defaultBtns();
        uiCtrl.emptyInputFields();
    });

    // Delete Button
    document.querySelector(".delete-btn").addEventListener("click", (e) => {
        e.preventDefault();

        const currentItem = itemCtrl.getItem();
        itemCtrl.deleteItem(currentItem.id);
        uiCtrl.deleteUiItem(currentItem.id);

        const total = itemCtrl.totalMoney();
        uiCtrl.displayTotal(total);

        uiCtrl.defaultBtns();
        uiCtrl.emptyInputFields();

        StrgeCtrl.deleteItemLs(currentItem.id);
    });

    // Clear Button
    document.querySelector(".clear-btn").addEventListener("click", () => {
        const ul = document.getElementById("item-list");
        ul.innerHTML = "";
        itemCtrl.clearData();

        const total = itemCtrl.totalMoney();
        uiCtrl.displayTotal(total);

        StrgeCtrl.clearAllItems();
    });

    return{
        init:() => {
            uiCtrl.defaultBtns();

            const items = itemCtrl.storedItems();
            items.forEach(ele => {
            uiCtrl.displayItems(ele);
            });

            const total = itemCtrl.totalMoney();
            uiCtrl.displayTotal(total);
        }
    }
})();

appCtrl.init();
