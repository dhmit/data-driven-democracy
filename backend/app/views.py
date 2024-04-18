"""
These view functions and classes implement both standard GET routes and API endpoints.

GET routes produce largely empty HTML pages that expect a React component to attach to them and
handle most view concerns. You can supply a few pieces of data in the render function's context
argument to support this expectation.

Of particular use are the properties: page_metadata, component_props, and component_name:
page_metadata: these values will be included in the page's <head> element.
Currently, only the `title` property is used. component_props: these can be any properties you
wish to pass into your React components as its highest-level props.
component_name: this should reference the exact name of the React component
you intend to load onto the page.

Example:
context = {
    'page_metadata': {
        'title': 'Example ID page'
    },
    'component_props': {
        'id': example_id
    },
    'component_name': 'ExampleId'
}
"""
from django.shortcuts import render, redirect


def index(request):
    """
    Home page
    """

    _context = {
        'page_metadata': {
            'title': 'Home page'
        },
        'component_name': 'Home'
    }

    return redirect("/competitiveness")


def competitiveness(request):
    """
    Competitiveness Map Page
    """

    context = {
        'page_metadata': {
            'title': 'Competitiveness Map'
        },

        'component_name': 'CompetitivenessMap',
    }
    return render(request, 'index.html', context)


def PieChart(request):
    """
    Displays PieChart for data from election campaign finance
    """

    context = {
        'page_metadata': {
            'title': 'PieChart Visualization '
        },
        'component_name': 'PieChart'
    }
    return render(request, 'index.html', context)


def BarChart(request):
    """
    Displays Bar Chart for data from election campaign finance
    """

    context = {
        'page_metadata': {
            'title': 'Bar Chart Visualization'
        },
        'component_name': 'BarChart'
    }
    return render(request, 'index.html', context)


def FinanceSankey(request):
    """
    Displays FinanceSankey for data from election campaign finance
    """

    context = {
        'page_metadata': {
            'title': 'FinanceSankey Visualization'
        },
        'component_name': 'FinanceSankey'
    }
    return render(request, 'index.html', context)
