Option Explicit

Dim shell, fso, projectDir, fileArg, serverDir, targetUrl, browserExe
Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
projectDir = fso.GetParentFolderName(WScript.ScriptFullName)

If WScript.Arguments.Count > 0 Then
  fileArg = WScript.Arguments(0)
  serverDir = fso.GetParentFolderName(fileArg)
  targetUrl = "http://127.0.0.1:8765/?file=" & UrlEncode(fso.GetAbsolutePathName(fileArg))
Else
  serverDir = fso.BuildPath(projectDir, "maps")
  targetUrl = "http://127.0.0.1:8765/"
End If

' Reuse the existing server when possible. Never kill another instance:
' each desktop window can safely open files using absolute paths.
shell.CurrentDirectory = projectDir
shell.Run "cmd.exe /c title simplemarkmap-server & node " & Q(fso.BuildPath(projectDir, "server.js")), 0, False

' Use PATH when node.exe is not next to the project.
If Not WaitForServer("http://127.0.0.1:8765/api/read?file=" & UrlEncode(fso.GetAbsolutePathName(fileArg)), 10000) Then
  shell.Run "cmd.exe /c title simplemarkmap-server & node " & Q(fso.BuildPath(projectDir, "server.js")), 0, False
  If Not WaitForServer("http://127.0.0.1:8765/api/read?file=" & UrlEncode(fso.GetAbsolutePathName(fileArg)), 10000) Then
    MsgBox "Nie udało się uruchomić simplemarkmap.", 16, "simplemarkmap"
    WScript.Quit 1
  End If
End If

browserExe = FindBrowser()
If browserExe <> "" Then
  shell.Run Q(browserExe) & " --app=" & Q(targetUrl), 1, False
Else
  shell.Run "cmd.exe /c start """" """ & targetUrl & """", 1, False
End If

Function WaitForServer(url, timeoutMs)
  Dim started, http
  started = Timer
  Do
    On Error Resume Next
    Set http = CreateObject("WinHttp.WinHttpRequest.5.1")
    http.Open "GET", url, False
    http.Send
    If Err.Number = 0 And http.Status > 0 Then
      WaitForServer = True
      Exit Function
    End If
    Err.Clear
    On Error GoTo 0
    WScript.Sleep 150
  Loop While ((Timer - started) * 1000) < timeoutMs Or Timer < started
  WaitForServer = False
End Function

Function FindBrowser()
  Dim paths, p, candidate
  paths = Array(shell.ExpandEnvironmentStrings("%ProgramFiles%\Google\Chrome\Application\chrome.exe"), shell.ExpandEnvironmentStrings("%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"), shell.ExpandEnvironmentStrings("%LocalAppData%\Google\Chrome\Application\chrome.exe"), shell.ExpandEnvironmentStrings("%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"), shell.ExpandEnvironmentStrings("%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"))
  For Each p In paths
    If fso.FileExists(p) Then FindBrowser = p : Exit Function
  Next
  FindBrowser = ""
End Function

Function UrlEncode(value)
  Dim i, ch, code, result
  result = ""
  For i = 1 To Len(value)
    ch = Mid(value, i, 1)
    code = AscW(ch)
    If (code >= 48 And code <= 57) Or (code >= 65 And code <= 90) Or (code >= 97 And code <= 122) Or ch = "." Or ch = "-" Or ch = "_" Then
      result = result & ch
    Else
      result = result & "%" & Right("0" & Hex(code And 255), 2)
    End If
  Next
  UrlEncode = result
End Function

Function Q(value)
  Q = Chr(34) & value & Chr(34)
End Function