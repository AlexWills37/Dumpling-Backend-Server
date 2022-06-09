// Yeah no this does't work this is just for me to test C# logic.
namespace Assets.Oculus.VR.Scripts
{

    enum TelemetryType : ushort
    {
        Chunked = 0,
        Full = 1
    }

    class Telemetry
    {
        public static string ROOT = "http://localhost:80/";
        public static TelemetryType type;
        public static string id;

        public Telemetry(TelemetryType t)
        {
            this.type = t;
        }

        public void init()
        {
            if (this.type == TelemetryType.Chunked)
            {
                var r = StartCoroutine(createNewSession());
            }
        }

        public string createNewSession() {
            using (UnityWebRequest webRequest = UnityWebRequest.get(ROOT + "session/new"))
            {
                yield return webRequest.SendWebRequest();
                
                switch (webRequest.responseCode)
                {
                    case 200:
                        // Parse JSON
                        var json = JsonUtility.FromJson<JsonData>(webRequest.downloadHandler.text);
                        id = json.data.session;
                    default:
                        Debug.Log("Error: " + webRequest.responseCode);
                        break;
                }
            }
        }
    }
}
