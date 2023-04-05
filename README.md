# Getting personalized recommendations for items

## About Personalize
AWS Personalize is an ML-based service that uses data to generate personalized recommendations. 
The current Personalize solution requires three parameters for each interaction to work:
1. USER_ID
    - For `USER_ID` this solution uses the `_ga` cookie. The `_ga` cookie lasts for 2 years.
2. ITEM_ID
    - The proposed in the scenario below `ITEM_ID` is the URL of the item.
3. TIMESTAMP
    - The `TIMESTAMP` is the Unix Timestamp of the request arrival time. It is added to the data in the Kinesis stream.

This solution was creating using the User-Personalization recipe. A recipe is the algorithm which AWS uses to train the model. The User-Personalization recipe works in the following way:

>The User-Personalization (aws-user-personalization) recipe is optimized for all personalized recommendation scenarios. It predicts the items that a user will interact with based on Interactions, Items, and Users datasets. When recommending items, it uses automatic item exploration.
With automatic exploration, Amazon Personalize automatically tests different item recommendations, learns from how users interact with these recommended items, and boosts recommendations for items that drive better engagement and conversion. This improves item discovery and engagement when you have a fast-changing catalog, or when new items, such as news articles or promotions, are more relevant to users when fresh.
You can balance how much to explore (where items with less interactions data or relevance are recommended more frequently) against how much to exploit (where recommendations are based on what we know or relevance). Amazon Personalize automatically adjusts future recommendations based on implicit user feedback.

#### User segmentation
AWS Personalize supports User segmentation with two recipes:
1. Item-Affinity
    - >The Item-Affinity (aws-item-affinity) recipe is a USER_SEGMENTATION recipe that creates a user segment (group of users) for each item that you specify. These are the users Amazon Personalize predicts will most likely interact with each item. 
2. Item-Attribute-Affinity
    - >The Item-Attribute-Affinity (aws-item-attribute-affinity) recipe is a USER_SEGMENTATION recipe that creates a user segment (group of users) for each item attribute that you specify. These are the users Amazon Personalize predicts will most likely interact with items with the particular attribute. 
      >For example, you might want to create a marketing campaign for your retail application based on user preferences for shoe types in your catalog. Item-Attribute-Affinity would create a user segment for each shoe type based data in your Interactions and Items datasets. You could use this to promote different shoes to different user segments based on the likelihood that they will take an action (for example, click a shoe or purchase a shoe). Other uses might include promoting different movie genres to different users or identifying prospective job applicant based on job type. 
    - The `Item-Attribute-Affinity` recipe requires an *Items dataset* with the **ITEM_ID**s and the respective attributes.

## Data requirements
+   At least 1000 interactions
+   At least 25 users
+   At least 2 interactions for every user
+   Data must be in CSV format with USER_ID, ITEM_ID and TIMESTAMP as the header

## Manual for using the API
1.  ```/collect``` endpoint:
    -   Create a `POST` request to the ```/collect``` endpoint specifying `ItemId` and `X-GA-Cookie` in the body of the request for every interaction
2.  ```/recommendations``` endpoint:
    -   Create a `POST` request to the ```/recommendations``` endpoint specifying `X-GA-Cookie` in the body of the request.
    -   The returned object contains IDs of recommended items with their recommendation score
- You can get the value of the `X-GA-Cookie` using the [js-cookie library](https://github.com/js-cookie/js-cookie). The examples below use the following method to get the cookie:
```Cookie.get("_ga")```

### Examples
1. Example snippet for getting recommendations
```
window.addEventListener("load", () => {
        fetch("https://agri.clientpoc.sevc.link/recommendations", {
            method: "POST",
            body: JSON.stringify({
                'X-GA-Cookie': Cookies.get("_ga")
            })
        })
        .then(res => res.json())
        .then(res => {
            //handler_fn(res)
        })
})
```
2. Example snippet for real time updates of the existing solution
```
window.addEventListener("load", () => {
    fetch("https://agri.clientpoc.sevc.link/collect", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            "ItemId": itemId,
            "X-GA-Cookie": Cookies.get("_ga")
        })
    })
})
```
### Scenario for using the solution
#### Prerequisites
- USER_ID
    - Google analytics sets a number of cookies used to collect data. This solution uses the `_ga` cookie for `USER_ID`. The `_ga` cookie is used to identify unique users and lasts for 2 years.
- ITEM_ID
    - This scenario uses the URL of the item as `ITEM_ID`

-  Google analytics to be enabled and the Google tag added to the website.
1. Open the Google Tag Manager menu
2. Create a new tag with **Custom HTML** as the configuration.
3. Paste the following code:
    ```
    <script>

        var url = window.location.href
        
        var itemId = url.replace(/^https?:\/\//i, '');
        var gaUserId = document.cookie.match(/_ga=(.+?);/)[1].split('.').slice(-2).join(".")
        
        var host = "https://agri.clientpoc.sevc.link"
        
        fetch(host + "/collect", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                "ItemId": itemId,
                "X-GA-Cookie": gaUserId
            })
        })

    </script>
    ```
4. Configure the triggers for the tag
    - Select **Page View** for *Trigger Type*
    - Select **Some Page Views** for *This trigger fires on*
    - For the filter select **Page URL** **contains** **novini**
5. Save the tag

### Diagram of the solution architecture
![Diagram of the architecture](/doc/diagram.png)
