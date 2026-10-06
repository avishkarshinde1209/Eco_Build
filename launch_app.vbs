Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "python """ & CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName) & "\launch_app.py""", 0, False
Set WshShell = Nothing
