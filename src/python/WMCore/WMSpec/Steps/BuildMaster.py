#!/usr/bin/env python
"""
_BuildMaster_

Overseer object that traverses a task and invokes the type based builder
for each step

"""
__author__ = "evansde"
__revision__ = "$Id: BuildMaster.py,v 1.7 2010/02/20 18:44:45 evansde Exp $"
__version__ = "$Revision: 1.7 $"

import os

import WMCore.WMSpec.Steps.StepFactory as StepFactory


header = \
"""
#!/usr/bin/env python

#
# WMTaskSpace entry point
# Autogenerated by WMCore.WMSpec.Steps.BuildMaster Module
__all__ = []

from WMCore.WMRuntime.Bootstrap import establishTaskSpace
def _Locator():
    pass
args = {}

"""


def initialiseWMTaskSpace(directory, taskName):
    """
    _initialiseWMTaskSpace_

    Build a top level working directory with the appropriate __init__.py
    module to define the top of a working area for a job

    """
    if not os.path.exists(directory):
        msg = "Directory %s not found" % directory
        raise RuntimeError, msg

    spaceDir = "%s/WMTaskSpace" % directory
    if os.path.exists(spaceDir):
        os.system("/bin/rm -r %s" % spaceDir)
    os.makedirs(spaceDir)

    initFile = "%s/__init__.py" % spaceDir
    handle = open(initFile, "w")
    handle.write(header)
    handle.write("""args["TaskName"] = "%s"\n""" % taskName)
    handle.write("""args["Locator"] = _Locator\n""")
    handle.write("""taskSpace = establishTaskSpace(**args)\n""")
    handle.close()
    return spaceDir



class BuildMaster:
    """
    _BuildMaster_

    """
    def __init__(self, workingDir):
        self.workDir = workingDir
        self.taskSpace = None


    def __call__(self, task):
        """
        _operator(task)_

        Invoke the builder on the task provided

        TODO: Exception handling

        """
        taskName = task.getPathName()
        self.taskSpace = initialiseWMTaskSpace(self.workDir, taskName)
        for step in task.steps().nodeIterator():
            stepType = step.stepType
            builder = StepFactory.getStepBuilder(stepType)
            builder(step, self.taskSpace)

