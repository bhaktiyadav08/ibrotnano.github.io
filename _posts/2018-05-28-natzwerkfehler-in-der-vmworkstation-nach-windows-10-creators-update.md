---
layout: post
title: "Natzwerkfehler in der VMWorkstation nach Windows 10 Creators-Update"
date:   2018-05-28 12:00:00 +0100
category: operations
tags: operations netzwerk error vmworkstation vm windows update
excerpt: "Nach dem Update hatten meine VMs keine Netzwerkverbindung mehr. Ich konnte die Einstellungen auch nicht mehr auf **bridged** ändern."
typora-copy-images-to: ..\assets\posts\2018-05-28-natzwerkfehler-in-der-vmworkstation-nach-windows-10-creators-update\images
typora-root-url: ..\
---
# Natzwerkfehler in der VMWorkstation nach Windows 10 Creators-Update

Nach dem Update hatten meine VMs keine Netzwerkverbindung mehr. Ich konnte die Einstellungen auch nicht mehr auf **bridged** ändern. Folgende Fehlermeldung wurde angezeigt:

![VMWare-Fehlermeldung](/assets/posts/2018-05-28-natzwerkfehler-in-der-vmworkstation-nach-windows-10-creators-update/images/Errormessage.png){:.img-content}

Um den Fehler zu beheben geht man wie folgt vor:

1. Mit der rechten Maustauste auf **Start** klicken und im Kontextmenü **Netwerkverbindungen** auswählen.

2. **Adapteroptionen ändern** anklicken

3. Mit der rechten Maustaste auf den Ethernetadapter klicken, der genutzt werden soll und **Eigenschaften** wählen

4. Hier prüfen ob **VMWare Bridge Protocol** installiert ist

5. Fall es nicht installiert ist auf **Installieren** klicken

6. **Dienst** auswählen und auf **Hinzufügen** klicken

7. Den Hersteller **VMWare, Inc.** wählen

8. **VMWare Bridge Protocol** als Netzwerkdienst auswählen

9. Mit **Ok** bestätigen

10. Den Dienst **vmnetbridge** starten 

    ```powershell
    PS C:\WINDOWS\system32> net start vmnetbridge

    VMware Bridge Protocol wurde erfolgreich gestartet.
    ```

11. Über den Button **Restore Defaults** des **Virtual Network Editors** die Defaults wieder herstellen![Restore Defaults](/assets/posts/2018-05-28-natzwerkfehler-in-der-vmworkstation-nach-windows-10-creators-update/images/restore-defaults.png){:.img-content}

Nun sollte die Netzwerkverbindung wieder funktionieren.