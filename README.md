
# 🚥 About the repository

Hands-on material for the platforms and tools I use across my machine learning, deep learning and forecasting courses. Every notebook has an **Open in Colab** badge at the top, so you can run everything in the browser with nothing to install.

| Folder | Content | Videos |
|---|---|---|
| [Python_Crash_course_2020](Python_Crash_course_2020) | Python basics, NumPy, pandas, Matplotlib, seaborn, time series, and exploratory data analysis (EDA) | [YouTube playlist](https://www.youtube.com/playlist?list=PL2GWo47BFyUPsqzaOdIdZlAwQmrXkSJxX) |
| [Google Colab](Google%20Colab) | Google Colab jumpstart notebook | [YouTube playlist](https://www.youtube.com/playlist?list=PL2GWo47BFyUOsj5rxrF9s6vRn0HCBEhpW) |
| [PyCaret](PyCaret) | Low-code machine learning with PyCaret: regression, classification, time series, and a stock price forecasting example | [YouTube playlist](https://youtube.com/playlist?list=PL2GWo47BFyUOqCAj_16yeNspfeM0nfA6q) |
| [uv](uv) | Running the course notebooks on your own computer with uv: student quick start, the conda-to-uv cheat sheet, and a ten-second test project. The same folder lives in the Machine Learning, Deep Learning and Deep Forecasting course repositories | |
| [vibe_coding](vibe_coding) | Slides on coding with AI assistants: Claude Code, Cursor, and VS Code with GitHub Copilot | |
| [data](data) | Datasets used in the notebooks | |


# ⚠️ PyCaret is now `pycaret-core`

The original `pycaret` package is no longer maintained and **does not run on current Python versions**, including the one on Google Colab. `pip install pycaret` (the command shown in my older videos) now ends in one of these:

* `RuntimeError: Pycaret only supports python 3.9, 3.10, 3.11 ... Please DOWNGRADE`
* a long failed build of NumPy

The notebooks in this repository use **`pycaret-core`**, the community-maintained continuation of PyCaret 3 under the sktime organization. Nothing changes in the code: you still write `import pycaret`, and `setup`, `compare_models`, `create_model`, `tune_model`, `plot_model` and the rest work the same way. Only the install command is different:

```
pip install pycaret-core lightgbm xgboost catboost shap
```

For the time series module, add `"statsmodels<0.15"` to that line.

**On Google Colab** you do not need to type anything. Each PyCaret notebook starts with an install cell that runs on Colab and does nothing anywhere else:

```python
import sys
if "google.colab" in sys.modules:
    !pip install -q pycaret-core lightgbm xgboost catboost shap
```

Run it in a fresh runtime (**Runtime > Disconnect and delete runtime**) before importing PyCaret. No runtime restart is needed afterwards.

**On your own computer**, each course repository ([Machine Learning](https://github.com/PJalgotrader/Machine_Learning-USU#setup), [Deep Learning](https://github.com/PJalgotrader/Deep_Learning-USU#how-to-run-the-notebooks), [Deep Forecasting](https://github.com/PJalgotrader/Deep_forecasting-USU#-getting-started)) ships a ready-made Python 3.13 environment that you build with **uv** (recommended) or **conda**, always with the same commands: `uv sync`, then `uv run jupyter lab`. These notebooks run in any of those environments. New to uv? Start with the [uv](uv) folder here: quick start, cheat sheet, ten-second test.


# 🚀 About Me

Pedram Jahangiry, CFA, is a Professional Practice Associate Professor of Data Analytics and Information Systems in the [Huntsman School of Business at Utah State University](https://huntsman.usu.edu/directory/jahangiry-pedram). Prior to joining the Huntsman School, Pedram was a research associate within the Financial Modeling Group at BlackRock NYC. His current research is involved in machine learning, deep learning and time series forecasting.
Pedram is one of the project mentors at the [Analytics Solutions Center](https://huntsman.usu.edu/asc/index), where students from across USU’s Logan and Statewide campuses work with corporate partners on analytics projects.


## 🔗 Links

[![linkedin](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/pedram-jahangiry-cfa-5778015a)

[![Youtube](https://img.shields.io/badge/youtube_channel-1DA1F2?style=for-the-badge&logo=youtube&logoColor=white&color=FF0000)](https://www.youtube.com/channel/UCNDElcuuyX-2pSatVBDpJJQ)

[![X URL](https://img.shields.io/twitter/url/https/twitter.com/PedramJahangiry.svg?style=social&label=Follow%20%40PedramJahangiry)](https://twitter.com/PedramJahangiry)


<img src="images/Jahangirylogo.png" width=150 align="right">
