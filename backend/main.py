from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, computed_field
from typing import Literal, Annotated
import pickle
import pandas as pd

# Load the model
with open('model.pkl', 'rb') as f:
    model = pickle.load(f)

app = FastAPI()

# Pydantic model
class UserInput(BaseModel):
    age: Annotated[int, Field(..., gt=0, lt=120, description='Age of the user')]
    weight: Annotated[float, Field(..., gt=0, description='Weight in kg')]
    height: Annotated[float, Field(..., gt=0, lt=2.5, description='Height in meters')]
    smoker: Annotated[bool, Field(..., description='Is user a smoker')]
    region: Annotated[Literal["southwest", "southeast", "northwest", "northeast"], Field(description='User region')]
    sex: Annotated[Literal["male", "female"], Field(description='Gender of the user')]
    children: Annotated[int, Field(..., ge=0, description='Number of children')]

    @computed_field
    @property
    def bmi(self) -> float:
        return self.weight / (self.height ** 2)

# API route
@app.post('/predict')
def predict_premium(data: UserInput):
    input_df = pd.DataFrame([{
        'age': data.age,
        'sex': str(data.sex),        
        'bmi': float(data.bmi),      
        'children': int(data.children),
        'smoker': 'yes' if data.smoker else 'no',  
        'region': str(data.region)   
    }])

    prediction = model.predict(input_df)[0]
    return JSONResponse(status_code=200, content={'Predicted Insurance': round(prediction, 2)})
