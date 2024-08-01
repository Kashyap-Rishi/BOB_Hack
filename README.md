# AI_Architects

What's Gen Ai ? more specifically what is LLM ?

Machine With calculation enabled + Understanding Natural Language + a self planner enabled( Our feature by Team Ai_Architects).

Human ?

calculative intelligence + Natural Language understanding +  consciousness + Human emotions .

Auditor ?

>RBI's enforcement actions against auditors with unsatisfactory performance can deter auditors from intentionally overlooking issues due to fear of repercussions from the bank's management

Auditor = Human - ( Human emotions ) = LLM 


---
### Ai will get integrated with human intelligence in coming future... And that future is now 👇

Streamlining Audits for Efficiency & Risk Reduction

This addresses all three points:

  1. Streamlining implies reducing repetitive tasks.
  2. Efficiency suggests tackling documentation chaos.
  3. Risk Reduction highlights the aim of mitigating increased risk.

---

We present 3 features of our solution :- 
  1. Ai Auditor ( A-MAS )
  2. Query Data Visualizer
  3. Recommendar for Auditing prefernces of Banks and Bank branches.

#### Solution Overview :- 
[Overview image ](ov.png)
![ov](https://github.com/sandeshlavshetty/AI_Architects/assets/138968398/fb0a9c10-a45a-4f14-adff-91fd7eb2e001)

[Finetuned LLM model](B_llm.png)

![B_llm](https://github.com/sandeshlavshetty/AI_Architects/assets/138968398/16af02db-943d-4484-882e-bf0ac28072ad)



1.  🥇Ai auditor ( A-MAS )
   A-MAS > Auditing Multi agent system

   Our Ai auditor performs the task of :-
   
     1️⃣. Document matching
   
     2️⃣. Form extraction
   
     3️⃣. Checking extracted data according to Auditing compliance rules
   
     4️⃣. reporting acceptable and anomalies parameters

   
[A-MAS](ovs_final.png)

![ovs_final](https://github.com/sandeshlavshetty/AI_Architects/assets/138968398/d924cef7-f407-47ae-9ed9-5cd26dde5b04)


Input of A-MAS :- 
  1. Invoice bill and data
  2. Supporting Documents to authorize in any format ( docs,pdfs,images,etc or SQL Database ) including it supports Multi-language

Output of A-MAS :- 
  1. Approved parameters and anomalies parameters ( parameters = auditing rules , and supporting documents authorization )
  2. Final Audit report
  3. In report detailed Citation of supported documents for approved parameters will given . ( Ensuring Explainable Ai protocol )

Human review :- 
  1. It gives the an chat interface where anomalies are reported to human user where person can resend the supporting documents for anomalies parameters and recorrect it

Working:

   A-MAS constitute of Graph, VectorDB,Statelist( Context Window memory )

     Graph :- It is based on Supervisor Hierarchical architecture 

       1.  Invoicer agent :- It schedule the task of one onvoice row to the documenter agent and initiate Documenter agent.

       2. Documenter agent :-  It extracts the required information for parameter pre-defined  using D1 and D2 further agents tools respectively from response recieved from Invoicer agent.

       3. Authorizer agent :- It check the parameters defined and authorizations and if correct it send to Approved parameter DB and in other case it saves in Anomalies parameter for further course of action.

      This loop continues for whole invoice bill.
       
    Human review :- 
       Every approved and non approved parameters are send to Chat interface one by one for human feedback and re run the process as per user recommendation if required .

    Tools :-  Langchain , LangGraph , VectorDB ,  GPT-finetuned ( [B-LLM](B_llm.png)) and other tools.


2. 🥈Query Data Visualizer
  [ Data Visualizer tool ](visual.png)
  ![visual](https://github.com/sandeshlavshetty/AI_Architects/assets/138968398/f2c59efa-3637-45d2-82b7-5e24cdf4fb96)

  Input :- 
   1. Any type of Banking and non-banking data which Banker/auditers/Heads want to see in visual presentation .
   2. Types of Diagram ( histogram,piecharts,etc.)
   3. Querry for which data visual user want through chat interface only in natural language.

  Output :- 
   1. It intially create self querry and create visual presentations of Data.
   2. The query can be given by user  and create on demand visual presentation with hassle free work.  ( e.g. create a line plot between loan approval and loan re-payments , create histogram for types of loans approved,etc)

    Working :-
     1. Data is first splitted into chunks and there respectivev context is stored in DB using our B-LLM.
     2. Based on User query a RAG(Retrieval-Augmented Generation) is performed and data is forwarded to viz-Generator.
     3. Viz-Generator ( Visual Generator ) generate the images and graphs based on Related data and showed at info-grapher stage.
     4. At info-grapher stage the Data-visualis are presented and further customizations are done ( e.g.* Sketch prompt: line sketch art,line drawing,etc ) through chat interface only in natural language.


3. 🥉Recommendar for Auditing prefernces of Banks and Bank branches.
   [Recommender](recd.png)

   ![recd](https://github.com/sandeshlavshetty/AI_Architects/assets/138968398/93b41002-29fb-4d71-81ea-313753770e00)

   Branch heads or maintainers of different branches of a bank will get recommendations for bank branches auditing prefernces and potential risks .

   This recommendaor will work on :-
     1. Bank branch transaction logs .
     2. Prevoius bank branch audit reports .

   Working :- It uses powerfull ML algorithms such as XGBOOST,CATBOOST,LGBM and our feature 1 i.e. Ai auditor to analyze the risk and uses voting classifier to determine best output at end .

---

#### Data Safety 

Each feature of our solution is enabled with security layer of Qpaque layer 

 working :-

  1. ![Screenshot 2024-06-28 214835](https://github.com/sandeshlavshetty/AI_Architects/assets/138968398/b5583260-e7e1-4d19-9303-a39aa267beb8)
  2. ![Screenshot 2024-06-28 214905](https://github.com/sandeshlavshetty/AI_Architects/assets/138968398/e34a228b-82b0-45da-a5df-afa954be892d)

This is achived through using tools like langchain and Microsoft Presidio


Thank-you.....

  
