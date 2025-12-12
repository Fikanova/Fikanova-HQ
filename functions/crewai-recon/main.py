from crewai import Agent, Task, Crew
import os

def main(context):
    try:
        url = context.req.body.get('url')
        researcher = Agent(role='Tech Scout', goal='Analyze stack', backstory='CTO')
        task = Task(description=f'Analyze {url}', agent=researcher)
        crew = Crew(agents=[researcher], tasks=[task])
        result = crew.kickoff()
        return context.res.json({"analysis": result})
    except Exception as e:
        return context.res.json({"error": str(e)})
