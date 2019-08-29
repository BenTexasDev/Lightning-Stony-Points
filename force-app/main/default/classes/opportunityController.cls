global with sharing class opportunityController {
    //API Level class (global)
    @AuraEnabled(cacheable=true)
    global static List<Opportunity> getOpportunities(Id accountId){

        List <Opportunity> opportunities = new List <Opportunity>();
        //Create query and then add to your list.
        for (Opportunity o: [SELECT Id,Account.Id,Name,StageName,Amount,CloseDate,isClosed,isWon,Owner.Name
                FROM Opportunity WHERE AccountId = :AccountId]){
                    opportunities.add(o);
                }
        //return the list
        return opportunities;
    }
}
