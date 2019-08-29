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
    //Wrapper class
   public class PicklistValue {
        @AuraEnabled public string label, value;        
        PicklistValue(String val, String lab) {
            label = lab;
            value = val;
        }
    }
    


@AuraEnabled(cacheable=true)
     public static PicklistValue[] getPicklistValues(String objectName, String fieldName){
            List<PicklistValue> values = new List<PicklistValue>();
            values.add(new PicklistValue('All', 'All'));
            values.add(new PicklistValue('Open', 'Open'));
            values.add(new PicklistValue('Closed', 'Closed'));
        //go find the stage picklist and get the values from it
        Schema.DescribeFieldResult fieldResult = Opportunity.StageName.getDescribe();
        List<Schema.PicklistEntry> entries = fieldResult.getPicklistValues();
        for(Schema.PicklistEntry f : entries)
        {
            values.add(new PicklistValue(f.getValue(), f.getLabel()));
        }     
       return values;
     }
       


}
